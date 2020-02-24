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
import { CoinReceivedService } from "../internal/services/coin-received-service";
import { TeamService } from "../internal/services/team-service";
import { groupBy } from "../../helper/groupBy";
import { ConstantService } from "../internal/services/constant-service";
import { CONSTANTS } from "../internal/db/models/constant";
// import { getLogger } from "../../logger";

export interface Viewer {
  userId: number;
  user: User;
  userRoles: string[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSystem: boolean;
  canViewAdmin: boolean;
  coinBalance: CoinBalance | null;
  coinsReceivedBalance: number;
}

interface GetViewerOptions {
  jwtToken: string;
  requestId?: string;
}

// const logger = getLogger("viewer");

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

  const [
    userRoles,
    coinBalance,
    coinsReceived,
    userTeams,
    constant
  ] = await Promise.all([
    new UserRoleService(systemContext).getAll({
      userId: user.id
    }),
    new CoinBalanceService(systemContext).getFirst({
      userId: user.id
    }),
    new CoinReceivedService(systemContext).getAll({
      allocatedToUserId: user.id,
      withTeam: true
    }),
    new TeamService(systemContext).getAll({
      userId: user.id
    }),
    new ConstantService(systemContext).getFirst({
      search: CONSTANTS.TEAM_MULTIPLIER
    })
  ]);
  let coinReceivedList = [];
  if (coinsReceived && coinsReceived.length > 0) {
    coinReceivedList = coinsReceived ? groupBy(coinsReceived, "id") : {};
  } else {
    const coinsWithoutTeam = await new CoinReceivedService(
      systemContext
    ).getAll({
      allocatedToUserId: user.id
    });
    coinReceivedList = coinsWithoutTeam ? groupBy(coinsWithoutTeam, "id") : {};
  }

  const userTeamsList = userTeams ? userTeams.map(team => team.id) : [];

  let coinsReceivedBalance = 0;

  coinsReceivedBalance = Object.values(coinReceivedList).reduce(
    (result: number, data: any) => {
      if (data) {
        const overlappingTeams = data.teamIds.filter((value: number) =>
          userTeamsList.includes(value)
        );
        if (overlappingTeams && overlappingTeams.length > 0) {
          return result + data.balance;
        } else {
          return result + data.balance * parseInt(constant?.value ?? "1", 10);
        }
      }
      return result;
    },
    coinsReceivedBalance
  );

  const isAdmin = !!(
    userRoles && userRoles.find(x => x.roleId === ROLES.ADMIN)
  );
  const isSuperAdmin = !!(
    userRoles && userRoles.find(x => x.roleId === ROLES.SUPER_ADMIN)
  );
  const canViewAdmin = isAdmin || isSuperAdmin;

  return {
    userId,
    user,
    userRoles: userRoles ? userRoles.map(x => x.roleId.toString()) : [],
    isAdmin: !!(isAdmin || isSuperAdmin),
    isSuperAdmin,
    isSystem: false,
    canViewAdmin,
    coinBalance,
    coinsReceivedBalance
  };
};
