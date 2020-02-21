import jwt from "jsonwebtoken";

import Config from "../../config";
import { ROLES } from "../../constants";
import User from "../internal/db/models/user";
import { getSystemViewer } from "./helpers";
import { UserService } from "../internal/services/user-service";
import { UserRoleService } from "../internal/services/user-role-service";
import { AppContext } from "./app-context";
import CoinBalance from "../internal/db/models/coin-balance";
import { CoinBalanceService } from "../internal/services/coin-balance-service";

export interface Viewer {
  userId: number;
  user: User;
  userRoles: string[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSystem: boolean;
  canViewAdmin: boolean;
  coinBalance: CoinBalance | null;
}

interface GetViewerOptions {
  jwtToken: string;
  requestId?: string;
}

export const getViewer = async (options: GetViewerOptions): Promise<Viewer> => {
  const jwtSecret = Config.getJwtSecret();
  const payload = jwt.verify(options.jwtToken, jwtSecret) as any;
  if (!payload || !payload.sub) {
    throw new Error("Invalid JWT specified.");
  }

  const systemViewer = await getSystemViewer();
  const systemContext: AppContext = {
    requestId: options.requestId || "?",
    viewer: systemViewer
  };

  const userId = parseInt(payload.sub, 10);
  const user = await new UserService(systemContext).getById(userId);
  if (!user) {
    throw new Error("Invalid JWT specified.");
  }

  const [userRoles] = await Promise.all([
    new UserRoleService(systemContext).getAll({
      userId: user.id
    })
  ]);

  const coinBalance = await new CoinBalanceService(systemContext).getFirst({
    userId: user.id
  });

  const isAdmin = !!userRoles.find(x => x.roleId === ROLES.ADMIN);
  const isSuperAdmin = !!userRoles.find(x => x.roleId === ROLES.SUPER_ADMIN);
  const canViewAdmin = isAdmin || isSuperAdmin;

  return {
    userId,
    user,
    userRoles: userRoles.map(x => x.roleId.toString()),
    isAdmin: isAdmin || isSuperAdmin,
    isSuperAdmin,
    isSystem: false,
    canViewAdmin,
    coinBalance
  };
};
