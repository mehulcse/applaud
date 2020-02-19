import { merge } from "lodash";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date";

import applaudReceivedQuery from "./queries/applaud-received";
import departmentQuery from "./queries/department";
import departmentsQuery from "./queries/departments";
import teamQuery from "./queries/team";
import teamsQuery from "./queries/teams";
import userQuery from "./queries/user";
import usersQuery from "./queries/users";
import createTeamMutation from "./mutations/create-team";
import createDepartmentMutation from "./mutations/create-department";
import updateTeamMutation from "./mutations/update-team";
import updateDepartmentMutation from "./mutations/update-department";























import createUserMutation from "./mutations/create-user";
import createUserRoleMutation from "./mutations/create-user-role";
import customerType from "./types/customer";
import domainType from "./types/domain";
import domainCategoryType from "./types/domain-category";
import loginUserMutation from "./mutations/login-user";
import logoutUserMutation from "./mutations/logout-user";
import orderType from "./types/order";
import partnerAvailableProductType from "./types/partner-available-product";
import partnerProductType from "./types/partner-product";
import partnerType from "./types/partner";
import partnerUserType from "./types/partner-user";
import userType from "./types/user";
import vendorType from "./types/vendor";
import vendorUserType from "./types/vendor-user";
import sitePostType from "./types/site-post";
import viewerQuery from "./queries/viewer";
import rolesQuery from "./queries/roles";
import siteType from "./types/site";

export default merge(
  { Date: GraphQLDate, DateTime: GraphQLDateTime, Time: GraphQLTime },
  createUserMutation,
  createUserRoleMutation,
  customerType,
  domainType,
  domainCategoryType,
  loginUserMutation,
  logoutUserMutation,
  orderType,
  partnerAvailableProductType,
  partnerProductType,
  partnerType,
  partnerUserType,

  applaudReceivedQuery,
  departmentQuery,
  departmentsQuery,
  teamQuery,
  teamsQuery,
  userQuery,
  usersQuery,
  viewerQuery,
  rolesQuery,
  createTeamMutation,
  createDepartmentMutation,
  updateTeamMutation,
  updateDepartmentMutation,

  userType,
  vendorType,
  vendorUserType,
  sitePostType,
  siteType
);
