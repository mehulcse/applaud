import jwt from "jsonwebtoken";

import Config from "../../config";
import { ROLES } from "../../constants";
import PartnerUser from "../internal/db/models/partner-user";
import User from "../internal/db/models/user";
import { getSystemViewer } from "./helpers";
import { UserService } from "../internal/services/user-service";
import { UserRoleService } from "../internal/services/user-role-service";
import { PartnerUserService } from "../internal/services/partner-user-service";
import { VendorUserService } from "../internal/services/vendor-user-service";
import VendorUser from "../internal/db/models/vendor-user";
import { AppContext } from "./app-context";

export interface Viewer {
  userId: number;
  user: User;
  userRoles: string[];
  partnerUser: PartnerUser | null;
  partnerUsers: PartnerUser[];
  vendorUser: VendorUser | null;
  vendorUsers: VendorUser[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isSystem: boolean;
  canViewAdmin: boolean;
  canViewPartner: boolean;
  canViewVendor: boolean;
}

interface GetViewerOptions {
  jwtToken: string;
  requestId?: string;
  partnerId?: number;
  vendorId?: number;
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
    viewer: systemViewer,
    partnerId: null,
    vendorId: null
  };

  const userId = parseInt(payload.sub, 10);
  const user = await new UserService(systemContext).getById(userId);
  if (!user || !user.isActive) {
    throw new Error("Invalid JWT specified.");
  }

  const [userRoles, partnerUsers, vendorUsers] = await Promise.all([
    new UserRoleService(systemContext).getAll({
      userId: user.id
    }),
    new PartnerUserService(systemContext).getAll({
      userId
    }),
    new VendorUserService(systemContext).getAll({
      userId
    })
  ]);

  const isAdmin = !!userRoles.find(x => x.roleId === ROLES.ADMIN);
  const isSuperAdmin = !!userRoles.find(x => x.roleId === ROLES.SUPER_ADMIN);
  const canViewAdmin = isAdmin || isSuperAdmin;
  const canViewPartner = isAdmin || partnerUsers.length > 0;
  const canViewVendor = isAdmin || vendorUsers.length > 0;

  return {
    userId,
    user,
    userRoles: userRoles.map(x => x.roleId.toString()),
    partnerUser:
      partnerUsers.find(x => x.partnerId === options.partnerId) || null,
    partnerUsers,
    vendorUser: vendorUsers.find(x => x.vendorId === options.vendorId) || null,
    vendorUsers,
    isAdmin: isAdmin || isSuperAdmin,
    isSuperAdmin,
    isSystem: false,
    canViewAdmin,
    canViewPartner,
    canViewVendor
  };
};
