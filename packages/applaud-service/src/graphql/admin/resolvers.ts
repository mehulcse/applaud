import { merge } from "lodash";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date";

import applaudReceivedQuery from "./queries/applaud-received";
import departmentQuery from "./queries/department";
import departmentsQuery from "./queries/departments";
import teamQuery from "./queries/team";
import teamsQuery from "./queries/teams";
import userQuery from "./queries/user";
import usersQuery from "./queries/users";























import createCategoryMutation from "./mutations/create-category";
import createDomainMutation from "./mutations/create-domain";
import createDomainCategoryMutation from "./mutations/create-domain-category";
import createPartnerMutation from "./mutations/create-partner";
import createPartnerAvailableProductMutation from "./mutations/create-partner-available-product";
import createPartnerUserMutation from "./mutations/create-partner-user";
import createUserMutation from "./mutations/create-user";
import createUserRoleMutation from "./mutations/create-user-role";
import createVendorMutation from "./mutations/create-vendor";
import createVendorUserMutation from "./mutations/create-vendor-user";
import createSiteMutation from "./mutations/create-site";
import createSitePostMutation from "./mutations/create-site-post";
import customerType from "./types/customer";
import deleteDomainCategoryMutation from "./mutations/delete-domain-category";
import domainType from "./types/domain";
import domainCategoryType from "./types/domain-category";
import loginUserMutation from "./mutations/login-user";
import logoutUserMutation from "./mutations/logout-user";
import orderType from "./types/order";
import partnerAvailableProductType from "./types/partner-available-product";
import partnerProductType from "./types/partner-product";
import partnerType from "./types/partner";
import partnerUserType from "./types/partner-user";
import updateCategoryMutation from "./mutations/update-category";
import updatePartnerMutation from "./mutations/update-partner";
import updatePartnerAvailableProductMutation from "./mutations/update-partner-available-product";
import updatePartnerUser from "./mutations/update-partner-user";
import updateVendorMutation from "./mutations/update-vendor";
import updateVendorUserMutation from "./mutations/update-vendor-user";
import updateSitePostMutation from "./mutations/update-site-post";
import deleteSitePostMutation from "./mutations/delete-site-post";
import userType from "./types/user";
import vendorType from "./types/vendor";
import vendorUserType from "./types/vendor-user";
import sitePostType from "./types/site-post";
import viewerQuery from "./queries/viewer";
import rolesQuery from "./queries/roles";
import siteType from "./types/site";

export default merge(
  { Date: GraphQLDate, DateTime: GraphQLDateTime, Time: GraphQLTime },
  createCategoryMutation,
  createDomainMutation,
  createDomainCategoryMutation,
  createPartnerMutation,
  createPartnerAvailableProductMutation,
  createPartnerUserMutation,
  createUserMutation,
  createUserRoleMutation,
  createVendorMutation,
  createVendorUserMutation,
  createSiteMutation,
  createSitePostMutation,
  customerType,
  domainType,
  domainCategoryType,
  deleteDomainCategoryMutation,
  loginUserMutation,
  logoutUserMutation,
  orderType,
  partnerAvailableProductType,
  partnerProductType,
  partnerType,
  partnerUserType,
  updateCategoryMutation,
  updatePartnerAvailableProductMutation,
  updatePartnerMutation,
  updatePartnerUser,
  updateVendorMutation,
  updateVendorUserMutation,
  updateSitePostMutation,
  deleteSitePostMutation,

  applaudReceivedQuery,
  departmentQuery,
  departmentsQuery,
  teamQuery,
  teamsQuery,
  userQuery,
  usersQuery,
  viewerQuery,
  rolesQuery,

  userType,
  vendorType,
  vendorUserType,
  sitePostType,
  siteType
);
