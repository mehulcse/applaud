import { merge } from "lodash";
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from "graphql-iso-date";

import applaudReceivedQuery from "./queries/applaud-received";
import departmentQuery from "./queries/department";
import departmentsQuery from "./queries/departments";
import teamQuery from "./queries/team";
import teamsQuery from "./queries/teams";
import userQuery from "./queries/user";
import usersQuery from "./queries/users";
import constantsQuery from "./queries/constants";
import createTeamMutation from "./mutations/create-team";
import createApplaudMutation from "./mutations/create-applaud";
import createDepartmentTeamMutation from "./mutations/create-department-team";
import createUserTeamMutation from "./mutations/create-user-team";
import createDepartmentMutation from "./mutations/create-department";
import updateTeamMutation from "./mutations/update-team";
import updateApplaudBalanceMutation from "./mutations/update-applaud-balance";
import updateUpdateConstantsMutation from "./mutations/update-constants";
import updateDepartmentMutation from "./mutations/update-department";
import createUserMutation from "./mutations/create-user";
import createUserRoleMutation from "./mutations/create-user-role";
import loginUserMutation from "./mutations/login-user";
import logoutUserMutation from "./mutations/logout-user";
import updateCoinBalanceMutation from "./mutations/update-coin-balance";
import viewerQuery from "./queries/viewer";
import rolesQuery from "./queries/roles";
import userType from "./types/user";
import applaudReceivedType from "./types/applaud-received";
import teamType from "./types/team";
import deleteUserTeamMutation from "./mutations/delete-user-team";
import deleteDepartmentTeamMutation from "./mutations/delete-department-team";

export default merge(
  { Date: GraphQLDate, DateTime: GraphQLDateTime, Time: GraphQLTime },
  createUserMutation,
  createUserRoleMutation,
  loginUserMutation,
  logoutUserMutation,
  applaudReceivedQuery,
  departmentQuery,
  departmentsQuery,
  constantsQuery,
  teamQuery,
  teamsQuery,
  userQuery,
  usersQuery,
  viewerQuery,
  rolesQuery,
  createApplaudMutation,
  createDepartmentTeamMutation,
  createTeamMutation,
  createUserTeamMutation,
  createDepartmentMutation,
  updateApplaudBalanceMutation,
  updateUpdateConstantsMutation,
  updateTeamMutation,
  updateDepartmentMutation,
  userType,
  applaudReceivedType,
  teamType,
  deleteUserTeamMutation,
  deleteDepartmentTeamMutation,
  updateCoinBalanceMutation
);
