import { Viewer } from "./viewer";
import { UnauthorizedAccessError } from "../../errors";
import User from "../internal/db/models/user";
import { SYSTEM_USER_ID, ROLES } from "../../constants";
import { AppContext } from "./app-context";

// For caching SYSTEM_USER in memory
let _systemUser: User | undefined;

export const ensureUser = (viewer: Viewer | null): Viewer => {
  if (!viewer || !viewer.user) {
    throw new UnauthorizedAccessError();
  }
  return viewer;
};

export const ensureAdmin = (viewer: Viewer | null): Viewer => {
  if (!viewer || !viewer.user || !viewer.isAdmin) {
    throw new UnauthorizedAccessError();
  }
  return viewer;
};

export const ensureSuperAdmin = (viewer: Viewer | null): Viewer => {
  if (
    !viewer ||
    !viewer.user ||
    !viewer.isSuperAdmin
  ) {
    throw new UnauthorizedAccessError();
  }
  return viewer;
};

export const ensureSystemUser = (viewer: Viewer | null): Viewer => {
  if (!viewer || !viewer.isSystem) {
    throw new UnauthorizedAccessError();
  }
  return viewer;
};

export const getAllowedPartnerIds = (viewer: Viewer | null): number[] => {
  if (!viewer) {
    return [];
  }
  return viewer.partnerUsers.map(x => x.partnerId);
};

export const ensurePartnerAuthorization = (
  viewer: Viewer | null,
  partnerId: number,
  isAdminRequired: boolean = false
): Viewer => {
  if (!viewer) {
    throw new UnauthorizedAccessError();
  }
  if (viewer.isAdmin || viewer.isSystem) {
    return viewer;
  }
  const partnerUser = viewer.partnerUsers.find(
    x => x.partnerId === partnerId && x.isAdmin
  );
  if (!partnerUser) {
    throw new UnauthorizedAccessError();
  }
  if (isAdminRequired && !partnerUser.isAdmin) {
    throw new UnauthorizedAccessError();
  }
  return viewer;
};

export const getSystemViewer = async (): Promise<Viewer> => {
  if (!_systemUser) {
    _systemUser = await User.query().findById(SYSTEM_USER_ID);
  }
  if (!_systemUser) {
    throw new Error("Unable to get appropriate permissions.");
  }

  return {
    isAdmin: true,
    isSuperAdmin: true,
    isSystem: true,
    partnerUser: null,
    partnerUsers: [],
    user: _systemUser,
    userId: SYSTEM_USER_ID,
    userRoles: [ROLES.ADMIN, ROLES.SUPER_ADMIN],
    vendorUser: null,
    vendorUsers: [],
    canViewAdmin: true,
    canViewPartner: true,
    canViewVendor: true
  };
};

export async function getSystemContext(
  requestId: string = "unknown"
): Promise<AppContext> {
  const systemViewer = await getSystemViewer();
  return {
    partnerId: null,
    requestId,
    vendorId: null,
    viewer: systemViewer
  };
}
