import gql from "graphql-tag";
import * as React from "react";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactComponents from "@apollo/react-components";
import * as ApolloReactHoc from "@apollo/react-hoc";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Maybe<T> = T | null;
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: Date;
  Date: string;
  Time: string;
};

export type Applaud = {
  __typename?: "Applaud";
  id: Scalars["Int"];
  balance: Scalars["Int"];
  allocatedToUserId: Scalars["Int"];
  message?: Maybe<Scalars["String"]>;
  type: Scalars["String"];
  createdAt: Scalars["DateTime"];
  allocatedToUser?: Maybe<User>;
};

export type ApplaudBalance = {
  __typename?: "ApplaudBalance";
  id: Scalars["Int"];
  balance: Scalars["Int"];
  userId: Scalars["Int"];
  allocatedAt: Scalars["DateTime"];
};

export type ApplaudConnection = {
  __typename?: "ApplaudConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes?: Maybe<Array<Applaud>>;
};

export enum ApplaudSort {
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC"
}

export type CoinBalance = {
  __typename?: "CoinBalance";
  id: Scalars["Int"];
  balance: Scalars["Int"];
  userId: Scalars["Int"];
};

export type Constant = {
  __typename?: "Constant";
  id: Scalars["Int"];
  name: Scalars["String"];
  value: Scalars["String"];
};

export type ConstantConnection = {
  __typename?: "ConstantConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes?: Maybe<Array<Constant>>;
};

export type Constants = {
  __typename?: "Constants";
  id: Scalars["Int"];
  name: Scalars["String"];
  value: Scalars["String"];
};

export type ConstantsConnection = {
  __typename?: "ConstantsConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes?: Maybe<Array<Constants>>;
};

export enum ConstantSort {
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC"
}

export type CreateApplaudInput = {
  balance: Scalars["Int"];
  allocatedToUserId: Scalars["Int"];
  allocatedByUserId: Scalars["Int"];
  message?: Maybe<Scalars["String"]>;
  type: Scalars["String"];
};

export type CreateApplaudResponse = {
  __typename?: "CreateApplaudResponse";
  applaud: Applaud;
};

export type CreateDepartmentInput = {
  name: Scalars["String"];
  description: Scalars["String"];
};

export type CreateDepartmentResponse = {
  __typename?: "CreateDepartmentResponse";
  department: Department;
};

export type CreateDepartmentTeamInput = {
  departmentId: Scalars["Int"];
  teamId: Scalars["Int"];
};

export type CreateDepartmentTeamResponse = {
  __typename?: "CreateDepartmentTeamResponse";
  departmentTeam: DepartmentTeam;
};

export type CreateTeamInput = {
  name: Scalars["String"];
  description: Scalars["String"];
};

export type CreateTeamResponse = {
  __typename?: "CreateTeamResponse";
  team: Team;
};

export type CreateUserInput = {
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email: Scalars["String"];
};

export type CreateUserResponse = {
  __typename?: "CreateUserResponse";
  user?: Maybe<User>;
};

export type CreateUserRoleInput = {
  userId: Scalars["Int"];
  roleId: Scalars["String"];
};

export type CreateUserRoleResponse = {
  __typename?: "CreateUserRoleResponse";
  userRole?: Maybe<UserRole>;
};

export type CreateUserTeamInput = {
  userId: Scalars["Int"];
  teamId: Scalars["Int"];
};

export type CreateUserTeamResponse = {
  __typename?: "CreateUserTeamResponse";
  userTeam: UserTeam;
};

export type DeleteDepartmentTeamInput = {
  teamId: Scalars["Int"];
  departmentId: Scalars["Int"];
};

export type DeleteDepartmentTeamResponse = {
  __typename?: "DeleteDepartmentTeamResponse";
  isDeleted?: Maybe<Scalars["Boolean"]>;
};

export type DeleteUserTeamInput = {
  teamId: Scalars["Int"];
  userId: Scalars["Int"];
};

export type DeleteUserTeamResponse = {
  __typename?: "DeleteUserTeamResponse";
  isDeleted?: Maybe<Scalars["Boolean"]>;
};

export type Department = {
  __typename?: "Department";
  id: Scalars["Int"];
  name: Scalars["String"];
  description: Scalars["String"];
};

export type DepartmentsConnection = {
  __typename?: "DepartmentsConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes?: Maybe<Array<Department>>;
};

export enum DepartmentsSort {
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC"
}

export type DepartmentTeam = {
  __typename?: "DepartmentTeam";
  id: Scalars["Int"];
  departmentId: Scalars["Int"];
  teamId: Scalars["Int"];
  createdAt: Scalars["DateTime"];
};

export type DepartmentTeamsConnection = {
  __typename?: "DepartmentTeamsConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes?: Maybe<Array<DepartmentTeam>>;
};

export enum DepartmentTeamsSort {
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC"
}

export type LoginUserInput = {
  googleIdToken?: Maybe<Scalars["String"]>;
  email?: Maybe<Scalars["String"]>;
  temporaryLoginCode?: Maybe<Scalars["String"]>;
  magicLink?: Maybe<Scalars["String"]>;
};

export type LoginUserResponse = {
  __typename?: "LoginUserResponse";
  isLoggedIn?: Maybe<Scalars["Boolean"]>;
};

export type LogoutUserResponse = {
  __typename?: "LogoutUserResponse";
  isLoggedOut: Scalars["Boolean"];
};

export type Mutation = {
  __typename?: "Mutation";
  createApplaud: CreateApplaudResponse;
  createTeam: CreateTeamResponse;
  createDepartment: CreateDepartmentResponse;
  createDepartmentTeam: CreateDepartmentTeamResponse;
  createUserTeam: CreateUserTeamResponse;
  createUser: CreateUserResponse;
  createUserRole: CreateUserRoleResponse;
  loginUser: LoginUserResponse;
  logoutUser: LogoutUserResponse;
  updateTeam: UpdateTeamResponse;
  updateDepartment: UpdateDepartmentResponse;
  updateApplaudBalance: UpdateApplaudBalanceResponse;
  updateConstants: UpdateConstantResponse;
  deleteUserTeam: DeleteUserTeamResponse;
  deleteDepartmentTeam: DeleteDepartmentTeamResponse;
  updateCoinBalance: UpdateCoinBalanceResponse;
};

export type MutationCreateApplaudArgs = {
  input: CreateApplaudInput;
};

export type MutationCreateTeamArgs = {
  input: CreateTeamInput;
};

export type MutationCreateDepartmentArgs = {
  input: CreateDepartmentInput;
};

export type MutationCreateDepartmentTeamArgs = {
  input: CreateDepartmentTeamInput;
};

export type MutationCreateUserTeamArgs = {
  input: CreateUserTeamInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationCreateUserRoleArgs = {
  input: CreateUserRoleInput;
};

export type MutationLoginUserArgs = {
  input: LoginUserInput;
};

export type MutationUpdateTeamArgs = {
  input: UpdateTeamInput;
};

export type MutationUpdateDepartmentArgs = {
  input: UpdateDepartmentInput;
};

export type MutationUpdateApplaudBalanceArgs = {
  input: UpdateApplaudBalanceInput;
};

export type MutationUpdateConstantsArgs = {
  input: UpdateConstantInput;
};

export type MutationDeleteUserTeamArgs = {
  input: DeleteUserTeamInput;
};

export type MutationDeleteDepartmentTeamArgs = {
  input: DeleteDepartmentTeamInput;
};

export type MutationUpdateCoinBalanceArgs = {
  input: UpdateCoinBalanceInput;
};

export type PageInfo = {
  __typename?: "PageInfo";
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
};

export type Query = {
  __typename?: "Query";
  applaud?: Maybe<ApplaudConnection>;
  department?: Maybe<Department>;
  departments?: Maybe<DepartmentsConnection>;
  roles?: Maybe<RoleConnection>;
  team?: Maybe<Team>;
  teams?: Maybe<TeamsConnection>;
  user?: Maybe<User>;
  users?: Maybe<UserConnection>;
  viewer?: Maybe<Viewer>;
  constants?: Maybe<ConstantsConnection>;
};

export type QueryApplaudArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  sort?: Maybe<ApplaudSort>;
  allocatedToUserId?: Maybe<Scalars["Int"]>;
  allocatedByUserId?: Maybe<Scalars["Int"]>;
};

export type QueryDepartmentArgs = {
  id: Scalars["Int"];
};

export type QueryDepartmentsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  sort?: Maybe<DepartmentsSort>;
  search?: Maybe<Scalars["String"]>;
  ids?: Maybe<Array<Scalars["Int"]>>;
};

export type QueryTeamArgs = {
  id: Scalars["Int"];
};

export type QueryTeamsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  sort?: Maybe<TeamsSort>;
  search?: Maybe<Scalars["String"]>;
  ids?: Maybe<Array<Scalars["Int"]>>;
};

export type QueryUserArgs = {
  id: Scalars["Int"];
};

export type QueryUsersArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  sort?: Maybe<UsersSort>;
  search?: Maybe<Scalars["String"]>;
  ids?: Maybe<Array<Scalars["Int"]>>;
};

export type QueryConstantsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  sort?: Maybe<TeamsSort>;
  search?: Maybe<Scalars["String"]>;
};

export type Role = {
  __typename?: "Role";
  id: Scalars["String"];
  name: Scalars["String"];
};

export type RoleConnection = {
  __typename?: "RoleConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes: Array<Role>;
};

export type Team = {
  __typename?: "Team";
  id: Scalars["Int"];
  name: Scalars["String"];
  description: Scalars["String"];
  departments?: Maybe<Array<Department>>;
};

export type TeamsConnection = {
  __typename?: "TeamsConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes?: Maybe<Array<Team>>;
};

export enum TeamsSort {
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC"
}

export type UpdateApplaudBalanceInput = {
  coinBalanceId: Scalars["Int"];
  balance: Scalars["Int"];
};

export type UpdateApplaudBalanceResponse = {
  __typename?: "UpdateApplaudBalanceResponse";
  applaudBalance: ApplaudBalance;
};

export type UpdateCoinBalanceInput = {
  quantity: Scalars["Int"];
};

export type UpdateCoinBalanceResponse = {
  __typename?: "UpdateCoinBalanceResponse";
  success: Scalars["Boolean"];
};

export type UpdateConstantInput = {
  constantId: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  value?: Maybe<Scalars["String"]>;
};

export type UpdateConstantResponse = {
  __typename?: "UpdateConstantResponse";
  constant: Constant;
};

export type UpdateDepartmentInput = {
  departmentId: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type UpdateDepartmentResponse = {
  __typename?: "UpdateDepartmentResponse";
  department: Department;
};

export type UpdateTeamInput = {
  teamId: Scalars["Int"];
  name?: Maybe<Scalars["String"]>;
  description?: Maybe<Scalars["String"]>;
};

export type UpdateTeamResponse = {
  __typename?: "UpdateTeamResponse";
  team: Team;
};

export type User = {
  __typename?: "User";
  id: Scalars["Int"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  email: Scalars["String"];
  userRoles: Array<UserRole>;
  fullName: Scalars["String"];
  teams?: Maybe<Array<Team>>;
};

export type UserConnection = {
  __typename?: "UserConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes: Array<User>;
};

export type UserRole = {
  __typename?: "UserRole";
  id: Scalars["Int"];
  userId: Scalars["Int"];
  roleId: Scalars["String"];
  createdAt: Scalars["DateTime"];
  user: User;
  role: Role;
};

export enum UsersSort {
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC"
}

export type UserTeam = {
  __typename?: "UserTeam";
  id: Scalars["Int"];
  userId: Scalars["Int"];
  teamId: Scalars["Int"];
  createdAt: Scalars["DateTime"];
};

export type UserTeamsConnection = {
  __typename?: "UserTeamsConnection";
  totalCount: Scalars["Int"];
  pageInfo?: Maybe<PageInfo>;
  nodes?: Maybe<Array<UserTeam>>;
};

export enum UserTeamsSort {
  IdAsc = "ID_ASC",
  IdDesc = "ID_DESC"
}

export type Viewer = {
  __typename?: "Viewer";
  isAdmin?: Maybe<Scalars["Boolean"]>;
  userRoles: Array<Scalars["String"]>;
  coinsReceivedBalance: Scalars["Int"];
  user: User;
  coinBalance?: Maybe<CoinBalance>;
};
export type DepartmentsForSelectorQueryVariables = {
  search?: Maybe<Scalars["String"]>;
  ids?: Maybe<Array<Scalars["Int"]>>;
};

export type DepartmentsForSelectorQuery = { __typename?: "Query" } & {
  departments: Maybe<
    { __typename?: "DepartmentsConnection" } & {
      nodes: Maybe<
        Array<{ __typename?: "Department" } & Pick<Department, "id" | "name">>
      >;
    }
  >;
};

export type TeamsForSelectorQueryVariables = {
  search?: Maybe<Scalars["String"]>;
  ids?: Maybe<Array<Scalars["Int"]>>;
};

export type TeamsForSelectorQuery = { __typename?: "Query" } & {
  teams: Maybe<
    { __typename?: "TeamsConnection" } & {
      nodes: Maybe<Array<{ __typename?: "Team" } & Pick<Team, "id" | "name">>>;
    }
  >;
};

export type UsersForSelectorQueryVariables = {
  search?: Maybe<Scalars["String"]>;
  ids?: Maybe<Array<Scalars["Int"]>>;
};

export type UsersForSelectorQuery = { __typename?: "Query" } & {
  users: Maybe<
    { __typename?: "UserConnection" } & {
      nodes: Array<{ __typename?: "User" } & Pick<User, "id" | "fullName">>;
    }
  >;
};

export type AuthManagerQueryVariables = {};

export type AuthManagerQuery = { __typename?: "Query" } & {
  viewer: Maybe<
    { __typename?: "Viewer" } & Pick<
      Viewer,
      "userRoles" | "isAdmin" | "coinsReceivedBalance"
    > & {
        user: { __typename?: "User" } & Pick<
          User,
          "id" | "firstName" | "lastName" | "email"
        >;
        coinBalance: Maybe<
          { __typename?: "CoinBalance" } & Pick<CoinBalance, "id" | "balance">
        >;
      }
  >;
};

export type LogoutUserMutationVariables = {};

export type LogoutUserMutation = { __typename?: "Mutation" } & {
  logoutUser: { __typename?: "LogoutUserResponse" } & Pick<
    LogoutUserResponse,
    "isLoggedOut"
  >;
};

export type CreateApplaudMutationVariables = {
  input: CreateApplaudInput;
};

export type CreateApplaudMutation = { __typename?: "Mutation" } & {
  createApplaud: { __typename?: "CreateApplaudResponse" } & {
    applaud: { __typename?: "Applaud" } & Pick<Applaud, "id">;
  };
};

export type ApplaudQueryVariables = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  allocatedToUserId?: Maybe<Scalars["Int"]>;
  allocatedByUserId?: Maybe<Scalars["Int"]>;
};

export type ApplaudQuery = { __typename?: "Query" } & {
  applaud: Maybe<
    { __typename?: "ApplaudConnection" } & Pick<
      ApplaudConnection,
      "totalCount"
    > & {
        nodes: Maybe<
          Array<
            { __typename?: "Applaud" } & Pick<
              Applaud,
              "id" | "allocatedToUserId" | "message" | "type" | "createdAt"
            > & {
                allocatedToUser: Maybe<
                  { __typename?: "User" } & Pick<
                    User,
                    "id" | "firstName" | "lastName" | "fullName"
                  >
                >;
              }
          >
        >;
      }
  >;
};

export type DepartmentQueryVariables = {
  id: Scalars["Int"];
};

export type DepartmentQuery = { __typename?: "Query" } & {
  department: Maybe<
    { __typename?: "Department" } & Pick<
      Department,
      "id" | "name" | "description"
    >
  >;
};

export type CreateDepartmentMutationVariables = {
  input: CreateDepartmentInput;
};

export type CreateDepartmentMutation = { __typename?: "Mutation" } & {
  createDepartment: { __typename?: "CreateDepartmentResponse" } & {
    department: { __typename?: "Department" } & Pick<Department, "id">;
  };
};

export type UpdateDepartmentMutationVariables = {
  input: UpdateDepartmentInput;
};

export type UpdateDepartmentMutation = { __typename?: "Mutation" } & {
  updateDepartment: { __typename?: "UpdateDepartmentResponse" } & {
    department: { __typename?: "Department" } & Pick<Department, "id">;
  };
};

export type DepartmentsQueryVariables = {
  search?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

export type DepartmentsQuery = { __typename?: "Query" } & {
  departments: Maybe<
    { __typename?: "DepartmentsConnection" } & Pick<
      DepartmentsConnection,
      "totalCount"
    > & {
        nodes: Maybe<
          Array<{ __typename?: "Department" } & Pick<Department, "id" | "name">>
        >;
      }
  >;
};

export type LoginUserMutationVariables = {
  input: LoginUserInput;
};

export type LoginUserMutation = { __typename?: "Mutation" } & {
  loginUser: { __typename?: "LoginUserResponse" } & Pick<
    LoginUserResponse,
    "isLoggedIn"
  >;
};

export type UpdateCoinBalanceMutationVariables = {
  input: UpdateCoinBalanceInput;
};

export type UpdateCoinBalanceMutation = { __typename?: "Mutation" } & {
  updateCoinBalance: { __typename?: "UpdateCoinBalanceResponse" } & Pick<
    UpdateCoinBalanceResponse,
    "success"
  >;
};

export type UpdateConstantsMutationVariables = {
  input: UpdateConstantInput;
};

export type UpdateConstantsMutation = { __typename?: "Mutation" } & {
  updateConstants: { __typename?: "UpdateConstantResponse" } & {
    constant: { __typename?: "Constant" } & Pick<
      Constant,
      "id" | "name" | "value"
    >;
  };
};

export type ConstantsQueryVariables = {
  search?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

export type ConstantsQuery = { __typename?: "Query" } & {
  constants: Maybe<
    { __typename?: "ConstantsConnection" } & Pick<
      ConstantsConnection,
      "totalCount"
    > & {
        nodes: Maybe<
          Array<
            { __typename?: "Constants" } & Pick<
              Constants,
              "id" | "name" | "value"
            >
          >
        >;
      }
  >;
};

export type TeamQueryVariables = {
  id: Scalars["Int"];
};

export type TeamQuery = { __typename?: "Query" } & {
  team: Maybe<
    { __typename?: "Team" } & Pick<Team, "id" | "name" | "description">
  >;
};

export type CreateTeamMutationVariables = {
  input: CreateTeamInput;
};

export type CreateTeamMutation = { __typename?: "Mutation" } & {
  createTeam: { __typename?: "CreateTeamResponse" } & {
    team: { __typename?: "Team" } & Pick<Team, "id">;
  };
};

export type UpdateTeamMutationVariables = {
  input: UpdateTeamInput;
};

export type UpdateTeamMutation = { __typename?: "Mutation" } & {
  updateTeam: { __typename?: "UpdateTeamResponse" } & {
    team: { __typename?: "Team" } & Pick<Team, "id">;
  };
};

export type TeamsQueryVariables = {
  search?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

export type TeamsQuery = { __typename?: "Query" } & {
  teams: Maybe<
    { __typename?: "TeamsConnection" } & Pick<TeamsConnection, "totalCount"> & {
        nodes: Maybe<
          Array<
            { __typename?: "Team" } & Pick<Team, "id" | "name"> & {
                departments: Maybe<
                  Array<
                    { __typename?: "Department" } & Pick<
                      Department,
                      "id" | "name"
                    >
                  >
                >;
              }
          >
        >;
      }
  >;
};

export type CreateUserTeamMutationVariables = {
  input: CreateUserTeamInput;
};

export type CreateUserTeamMutation = { __typename?: "Mutation" } & {
  createUserTeam: { __typename?: "CreateUserTeamResponse" } & {
    userTeam: { __typename?: "UserTeam" } & Pick<UserTeam, "id">;
  };
};

export type DeleteUserTeamMutationVariables = {
  input: DeleteUserTeamInput;
};

export type DeleteUserTeamMutation = { __typename?: "Mutation" } & {
  deleteUserTeam: { __typename?: "DeleteUserTeamResponse" } & Pick<
    DeleteUserTeamResponse,
    "isDeleted"
  >;
};

export type UserDetailQueryVariables = {
  id: Scalars["Int"];
};

export type UserDetailQuery = { __typename?: "Query" } & {
  user: Maybe<
    { __typename?: "User" } & Pick<User, "id" | "fullName" | "email"> & {
        teams: Maybe<
          Array<{ __typename?: "Team" } & Pick<Team, "id" | "name">>
        >;
      }
  >;
};

export type UserQueryVariables = {
  id: Scalars["Int"];
};

export type UserQuery = { __typename?: "Query" } & {
  user: Maybe<
    { __typename?: "User" } & Pick<
      User,
      "id" | "firstName" | "lastName" | "email"
    >
  >;
};

export type CreateUserMutationVariables = {
  input: CreateUserInput;
};

export type CreateUserMutation = { __typename?: "Mutation" } & {
  createUser: { __typename?: "CreateUserResponse" } & {
    user: Maybe<{ __typename?: "User" } & Pick<User, "id">>;
  };
};

export type UsersQueryVariables = {
  search?: Maybe<Scalars["String"]>;
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
};

export type UsersQuery = { __typename?: "Query" } & {
  users: Maybe<
    { __typename?: "UserConnection" } & Pick<UserConnection, "totalCount"> & {
        nodes: Array<
          { __typename?: "User" } & Pick<User, "id" | "email" | "fullName"> & {
              teams: Maybe<
                Array<{ __typename?: "Team" } & Pick<Team, "id" | "name">>
              >;
            }
        >;
      }
  >;
};

export const DepartmentsForSelectorDocument = gql`
  query DepartmentsForSelector($search: String, $ids: [Int!]) {
    departments(search: $search, ids: $ids) {
      nodes {
        id
        name
      }
    }
  }
`;
export type DepartmentsForSelectorComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    DepartmentsForSelectorQuery,
    DepartmentsForSelectorQueryVariables
  >,
  "query"
>;

export const DepartmentsForSelectorComponent = (
  props: DepartmentsForSelectorComponentProps
) => (
  <ApolloReactComponents.Query<
    DepartmentsForSelectorQuery,
    DepartmentsForSelectorQueryVariables
  >
    query={DepartmentsForSelectorDocument}
    {...props}
  />
);

export type DepartmentsForSelectorProps<
  TChildProps = {}
> = ApolloReactHoc.DataProps<
  DepartmentsForSelectorQuery,
  DepartmentsForSelectorQueryVariables
> &
  TChildProps;
export function withDepartmentsForSelector<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    DepartmentsForSelectorQuery,
    DepartmentsForSelectorQueryVariables,
    DepartmentsForSelectorProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    DepartmentsForSelectorQuery,
    DepartmentsForSelectorQueryVariables,
    DepartmentsForSelectorProps<TChildProps>
  >(DepartmentsForSelectorDocument, {
    alias: "withDepartmentsForSelector",
    ...operationOptions
  });
}

export function useDepartmentsForSelectorQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    DepartmentsForSelectorQuery,
    DepartmentsForSelectorQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    DepartmentsForSelectorQuery,
    DepartmentsForSelectorQueryVariables
  >(DepartmentsForSelectorDocument, baseOptions);
}
export function useDepartmentsForSelectorLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DepartmentsForSelectorQuery,
    DepartmentsForSelectorQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    DepartmentsForSelectorQuery,
    DepartmentsForSelectorQueryVariables
  >(DepartmentsForSelectorDocument, baseOptions);
}

export type DepartmentsForSelectorQueryHookResult = ReturnType<
  typeof useDepartmentsForSelectorQuery
>;
export type DepartmentsForSelectorQueryResult = ApolloReactCommon.QueryResult<
  DepartmentsForSelectorQuery,
  DepartmentsForSelectorQueryVariables
>;
export const TeamsForSelectorDocument = gql`
  query TeamsForSelector($search: String, $ids: [Int!]) {
    teams(search: $search, ids: $ids) {
      nodes {
        id
        name
      }
    }
  }
`;
export type TeamsForSelectorComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    TeamsForSelectorQuery,
    TeamsForSelectorQueryVariables
  >,
  "query"
>;

export const TeamsForSelectorComponent = (
  props: TeamsForSelectorComponentProps
) => (
  <ApolloReactComponents.Query<
    TeamsForSelectorQuery,
    TeamsForSelectorQueryVariables
  >
    query={TeamsForSelectorDocument}
    {...props}
  />
);

export type TeamsForSelectorProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  TeamsForSelectorQuery,
  TeamsForSelectorQueryVariables
> &
  TChildProps;
export function withTeamsForSelector<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    TeamsForSelectorQuery,
    TeamsForSelectorQueryVariables,
    TeamsForSelectorProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    TeamsForSelectorQuery,
    TeamsForSelectorQueryVariables,
    TeamsForSelectorProps<TChildProps>
  >(TeamsForSelectorDocument, {
    alias: "withTeamsForSelector",
    ...operationOptions
  });
}

export function useTeamsForSelectorQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TeamsForSelectorQuery,
    TeamsForSelectorQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    TeamsForSelectorQuery,
    TeamsForSelectorQueryVariables
  >(TeamsForSelectorDocument, baseOptions);
}
export function useTeamsForSelectorLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TeamsForSelectorQuery,
    TeamsForSelectorQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    TeamsForSelectorQuery,
    TeamsForSelectorQueryVariables
  >(TeamsForSelectorDocument, baseOptions);
}

export type TeamsForSelectorQueryHookResult = ReturnType<
  typeof useTeamsForSelectorQuery
>;
export type TeamsForSelectorQueryResult = ApolloReactCommon.QueryResult<
  TeamsForSelectorQuery,
  TeamsForSelectorQueryVariables
>;
export const UsersForSelectorDocument = gql`
  query UsersForSelector($search: String, $ids: [Int!]) {
    users(search: $search, ids: $ids) {
      nodes {
        id
        fullName
      }
    }
  }
`;
export type UsersForSelectorComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    UsersForSelectorQuery,
    UsersForSelectorQueryVariables
  >,
  "query"
>;

export const UsersForSelectorComponent = (
  props: UsersForSelectorComponentProps
) => (
  <ApolloReactComponents.Query<
    UsersForSelectorQuery,
    UsersForSelectorQueryVariables
  >
    query={UsersForSelectorDocument}
    {...props}
  />
);

export type UsersForSelectorProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  UsersForSelectorQuery,
  UsersForSelectorQueryVariables
> &
  TChildProps;
export function withUsersForSelector<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UsersForSelectorQuery,
    UsersForSelectorQueryVariables,
    UsersForSelectorProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    UsersForSelectorQuery,
    UsersForSelectorQueryVariables,
    UsersForSelectorProps<TChildProps>
  >(UsersForSelectorDocument, {
    alias: "withUsersForSelector",
    ...operationOptions
  });
}

export function useUsersForSelectorQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UsersForSelectorQuery,
    UsersForSelectorQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    UsersForSelectorQuery,
    UsersForSelectorQueryVariables
  >(UsersForSelectorDocument, baseOptions);
}
export function useUsersForSelectorLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UsersForSelectorQuery,
    UsersForSelectorQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    UsersForSelectorQuery,
    UsersForSelectorQueryVariables
  >(UsersForSelectorDocument, baseOptions);
}

export type UsersForSelectorQueryHookResult = ReturnType<
  typeof useUsersForSelectorQuery
>;
export type UsersForSelectorQueryResult = ApolloReactCommon.QueryResult<
  UsersForSelectorQuery,
  UsersForSelectorQueryVariables
>;
export const AuthManagerDocument = gql`
  query AuthManager {
    viewer {
      userRoles
      isAdmin
      user {
        id
        firstName
        lastName
        email
      }
      coinBalance {
        id
        balance
      }
      coinsReceivedBalance
    }
  }
`;
export type AuthManagerComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    AuthManagerQuery,
    AuthManagerQueryVariables
  >,
  "query"
>;

export const AuthManagerComponent = (props: AuthManagerComponentProps) => (
  <ApolloReactComponents.Query<AuthManagerQuery, AuthManagerQueryVariables>
    query={AuthManagerDocument}
    {...props}
  />
);

export type AuthManagerProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  AuthManagerQuery,
  AuthManagerQueryVariables
> &
  TChildProps;
export function withAuthManager<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    AuthManagerQuery,
    AuthManagerQueryVariables,
    AuthManagerProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    AuthManagerQuery,
    AuthManagerQueryVariables,
    AuthManagerProps<TChildProps>
  >(AuthManagerDocument, {
    alias: "withAuthManager",
    ...operationOptions
  });
}

export function useAuthManagerQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    AuthManagerQuery,
    AuthManagerQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<AuthManagerQuery, AuthManagerQueryVariables>(
    AuthManagerDocument,
    baseOptions
  );
}
export function useAuthManagerLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    AuthManagerQuery,
    AuthManagerQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    AuthManagerQuery,
    AuthManagerQueryVariables
  >(AuthManagerDocument, baseOptions);
}

export type AuthManagerQueryHookResult = ReturnType<typeof useAuthManagerQuery>;
export type AuthManagerQueryResult = ApolloReactCommon.QueryResult<
  AuthManagerQuery,
  AuthManagerQueryVariables
>;
export const LogoutUserDocument = gql`
  mutation LogoutUser {
    logoutUser {
      isLoggedOut
    }
  }
`;
export type LogoutUserMutationFn = ApolloReactCommon.MutationFunction<
  LogoutUserMutation,
  LogoutUserMutationVariables
>;
export type LogoutUserComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    LogoutUserMutation,
    LogoutUserMutationVariables
  >,
  "mutation"
>;

export const LogoutUserComponent = (props: LogoutUserComponentProps) => (
  <ApolloReactComponents.Mutation<
    LogoutUserMutation,
    LogoutUserMutationVariables
  >
    mutation={LogoutUserDocument}
    {...props}
  />
);

export type LogoutUserProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  LogoutUserMutation,
  LogoutUserMutationVariables
> &
  TChildProps;
export function withLogoutUser<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    LogoutUserMutation,
    LogoutUserMutationVariables,
    LogoutUserProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    LogoutUserMutation,
    LogoutUserMutationVariables,
    LogoutUserProps<TChildProps>
  >(LogoutUserDocument, {
    alias: "withLogoutUser",
    ...operationOptions
  });
}

export function useLogoutUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LogoutUserMutation,
    LogoutUserMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    LogoutUserMutation,
    LogoutUserMutationVariables
  >(LogoutUserDocument, baseOptions);
}
export type LogoutUserMutationHookResult = ReturnType<
  typeof useLogoutUserMutation
>;
export type LogoutUserMutationResult = ApolloReactCommon.MutationResult<
  LogoutUserMutation
>;
export type LogoutUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LogoutUserMutation,
  LogoutUserMutationVariables
>;
export const CreateApplaudDocument = gql`
  mutation CreateApplaud($input: CreateApplaudInput!) {
    createApplaud(input: $input) {
      applaud {
        id
      }
    }
  }
`;
export type CreateApplaudMutationFn = ApolloReactCommon.MutationFunction<
  CreateApplaudMutation,
  CreateApplaudMutationVariables
>;
export type CreateApplaudComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    CreateApplaudMutation,
    CreateApplaudMutationVariables
  >,
  "mutation"
>;

export const CreateApplaudComponent = (props: CreateApplaudComponentProps) => (
  <ApolloReactComponents.Mutation<
    CreateApplaudMutation,
    CreateApplaudMutationVariables
  >
    mutation={CreateApplaudDocument}
    {...props}
  />
);

export type CreateApplaudProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  CreateApplaudMutation,
  CreateApplaudMutationVariables
> &
  TChildProps;
export function withCreateApplaud<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateApplaudMutation,
    CreateApplaudMutationVariables,
    CreateApplaudProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateApplaudMutation,
    CreateApplaudMutationVariables,
    CreateApplaudProps<TChildProps>
  >(CreateApplaudDocument, {
    alias: "withCreateApplaud",
    ...operationOptions
  });
}

export function useCreateApplaudMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateApplaudMutation,
    CreateApplaudMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateApplaudMutation,
    CreateApplaudMutationVariables
  >(CreateApplaudDocument, baseOptions);
}
export type CreateApplaudMutationHookResult = ReturnType<
  typeof useCreateApplaudMutation
>;
export type CreateApplaudMutationResult = ApolloReactCommon.MutationResult<
  CreateApplaudMutation
>;
export type CreateApplaudMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateApplaudMutation,
  CreateApplaudMutationVariables
>;
export const ApplaudDocument = gql`
  query Applaud(
    $limit: Int
    $offset: Int
    $allocatedToUserId: Int
    $allocatedByUserId: Int
  ) {
    applaud(
      limit: $limit
      offset: $offset
      allocatedToUserId: $allocatedToUserId
      allocatedByUserId: $allocatedByUserId
    ) {
      totalCount
      nodes {
        id
        allocatedToUserId
        message
        type
        createdAt
        allocatedToUser {
          id
          firstName
          lastName
          fullName
        }
      }
    }
  }
`;
export type ApplaudComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    ApplaudQuery,
    ApplaudQueryVariables
  >,
  "query"
>;

export const ApplaudComponent = (props: ApplaudComponentProps) => (
  <ApolloReactComponents.Query<ApplaudQuery, ApplaudQueryVariables>
    query={ApplaudDocument}
    {...props}
  />
);

export type ApplaudProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  ApplaudQuery,
  ApplaudQueryVariables
> &
  TChildProps;
export function withApplaud<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ApplaudQuery,
    ApplaudQueryVariables,
    ApplaudProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ApplaudQuery,
    ApplaudQueryVariables,
    ApplaudProps<TChildProps>
  >(ApplaudDocument, {
    alias: "withApplaud",
    ...operationOptions
  });
}

export function useApplaudQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ApplaudQuery,
    ApplaudQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<ApplaudQuery, ApplaudQueryVariables>(
    ApplaudDocument,
    baseOptions
  );
}
export function useApplaudLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ApplaudQuery,
    ApplaudQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<ApplaudQuery, ApplaudQueryVariables>(
    ApplaudDocument,
    baseOptions
  );
}

export type ApplaudQueryHookResult = ReturnType<typeof useApplaudQuery>;
export type ApplaudQueryResult = ApolloReactCommon.QueryResult<
  ApplaudQuery,
  ApplaudQueryVariables
>;
export const DepartmentDocument = gql`
  query Department($id: Int!) {
    department(id: $id) {
      id
      name
      description
    }
  }
`;
export type DepartmentComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    DepartmentQuery,
    DepartmentQueryVariables
  >,
  "query"
> &
  ({ variables: DepartmentQueryVariables; skip?: boolean } | { skip: boolean });

export const DepartmentComponent = (props: DepartmentComponentProps) => (
  <ApolloReactComponents.Query<DepartmentQuery, DepartmentQueryVariables>
    query={DepartmentDocument}
    {...props}
  />
);

export type DepartmentProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  DepartmentQuery,
  DepartmentQueryVariables
> &
  TChildProps;
export function withDepartment<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    DepartmentQuery,
    DepartmentQueryVariables,
    DepartmentProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    DepartmentQuery,
    DepartmentQueryVariables,
    DepartmentProps<TChildProps>
  >(DepartmentDocument, {
    alias: "withDepartment",
    ...operationOptions
  });
}

export function useDepartmentQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    DepartmentQuery,
    DepartmentQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<DepartmentQuery, DepartmentQueryVariables>(
    DepartmentDocument,
    baseOptions
  );
}
export function useDepartmentLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DepartmentQuery,
    DepartmentQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    DepartmentQuery,
    DepartmentQueryVariables
  >(DepartmentDocument, baseOptions);
}

export type DepartmentQueryHookResult = ReturnType<typeof useDepartmentQuery>;
export type DepartmentQueryResult = ApolloReactCommon.QueryResult<
  DepartmentQuery,
  DepartmentQueryVariables
>;
export const CreateDepartmentDocument = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      department {
        id
      }
    }
  }
`;
export type CreateDepartmentMutationFn = ApolloReactCommon.MutationFunction<
  CreateDepartmentMutation,
  CreateDepartmentMutationVariables
>;
export type CreateDepartmentComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    CreateDepartmentMutation,
    CreateDepartmentMutationVariables
  >,
  "mutation"
>;

export const CreateDepartmentComponent = (
  props: CreateDepartmentComponentProps
) => (
  <ApolloReactComponents.Mutation<
    CreateDepartmentMutation,
    CreateDepartmentMutationVariables
  >
    mutation={CreateDepartmentDocument}
    {...props}
  />
);

export type CreateDepartmentProps<
  TChildProps = {}
> = ApolloReactHoc.MutateProps<
  CreateDepartmentMutation,
  CreateDepartmentMutationVariables
> &
  TChildProps;
export function withCreateDepartment<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateDepartmentMutation,
    CreateDepartmentMutationVariables,
    CreateDepartmentProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateDepartmentMutation,
    CreateDepartmentMutationVariables,
    CreateDepartmentProps<TChildProps>
  >(CreateDepartmentDocument, {
    alias: "withCreateDepartment",
    ...operationOptions
  });
}

export function useCreateDepartmentMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateDepartmentMutation,
    CreateDepartmentMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateDepartmentMutation,
    CreateDepartmentMutationVariables
  >(CreateDepartmentDocument, baseOptions);
}
export type CreateDepartmentMutationHookResult = ReturnType<
  typeof useCreateDepartmentMutation
>;
export type CreateDepartmentMutationResult = ApolloReactCommon.MutationResult<
  CreateDepartmentMutation
>;
export type CreateDepartmentMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateDepartmentMutation,
  CreateDepartmentMutationVariables
>;
export const UpdateDepartmentDocument = gql`
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      department {
        id
      }
    }
  }
`;
export type UpdateDepartmentMutationFn = ApolloReactCommon.MutationFunction<
  UpdateDepartmentMutation,
  UpdateDepartmentMutationVariables
>;
export type UpdateDepartmentComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    UpdateDepartmentMutation,
    UpdateDepartmentMutationVariables
  >,
  "mutation"
>;

export const UpdateDepartmentComponent = (
  props: UpdateDepartmentComponentProps
) => (
  <ApolloReactComponents.Mutation<
    UpdateDepartmentMutation,
    UpdateDepartmentMutationVariables
  >
    mutation={UpdateDepartmentDocument}
    {...props}
  />
);

export type UpdateDepartmentProps<
  TChildProps = {}
> = ApolloReactHoc.MutateProps<
  UpdateDepartmentMutation,
  UpdateDepartmentMutationVariables
> &
  TChildProps;
export function withUpdateDepartment<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UpdateDepartmentMutation,
    UpdateDepartmentMutationVariables,
    UpdateDepartmentProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    UpdateDepartmentMutation,
    UpdateDepartmentMutationVariables,
    UpdateDepartmentProps<TChildProps>
  >(UpdateDepartmentDocument, {
    alias: "withUpdateDepartment",
    ...operationOptions
  });
}

export function useUpdateDepartmentMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateDepartmentMutation,
    UpdateDepartmentMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateDepartmentMutation,
    UpdateDepartmentMutationVariables
  >(UpdateDepartmentDocument, baseOptions);
}
export type UpdateDepartmentMutationHookResult = ReturnType<
  typeof useUpdateDepartmentMutation
>;
export type UpdateDepartmentMutationResult = ApolloReactCommon.MutationResult<
  UpdateDepartmentMutation
>;
export type UpdateDepartmentMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateDepartmentMutation,
  UpdateDepartmentMutationVariables
>;
export const DepartmentsDocument = gql`
  query Departments($search: String, $limit: Int, $offset: Int) {
    departments(search: $search, limit: $limit, offset: $offset) {
      totalCount
      nodes {
        id
        name
      }
    }
  }
`;
export type DepartmentsComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    DepartmentsQuery,
    DepartmentsQueryVariables
  >,
  "query"
>;

export const DepartmentsComponent = (props: DepartmentsComponentProps) => (
  <ApolloReactComponents.Query<DepartmentsQuery, DepartmentsQueryVariables>
    query={DepartmentsDocument}
    {...props}
  />
);

export type DepartmentsProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  DepartmentsQuery,
  DepartmentsQueryVariables
> &
  TChildProps;
export function withDepartments<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    DepartmentsQuery,
    DepartmentsQueryVariables,
    DepartmentsProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    DepartmentsQuery,
    DepartmentsQueryVariables,
    DepartmentsProps<TChildProps>
  >(DepartmentsDocument, {
    alias: "withDepartments",
    ...operationOptions
  });
}

export function useDepartmentsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    DepartmentsQuery,
    DepartmentsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<DepartmentsQuery, DepartmentsQueryVariables>(
    DepartmentsDocument,
    baseOptions
  );
}
export function useDepartmentsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    DepartmentsQuery,
    DepartmentsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    DepartmentsQuery,
    DepartmentsQueryVariables
  >(DepartmentsDocument, baseOptions);
}

export type DepartmentsQueryHookResult = ReturnType<typeof useDepartmentsQuery>;
export type DepartmentsQueryResult = ApolloReactCommon.QueryResult<
  DepartmentsQuery,
  DepartmentsQueryVariables
>;
export const LoginUserDocument = gql`
  mutation loginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      isLoggedIn
    }
  }
`;
export type LoginUserMutationFn = ApolloReactCommon.MutationFunction<
  LoginUserMutation,
  LoginUserMutationVariables
>;
export type LoginUserComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    LoginUserMutation,
    LoginUserMutationVariables
  >,
  "mutation"
>;

export const LoginUserComponent = (props: LoginUserComponentProps) => (
  <ApolloReactComponents.Mutation<LoginUserMutation, LoginUserMutationVariables>
    mutation={LoginUserDocument}
    {...props}
  />
);

export type LoginUserProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  LoginUserMutation,
  LoginUserMutationVariables
> &
  TChildProps;
export function withLoginUser<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    LoginUserMutation,
    LoginUserMutationVariables,
    LoginUserProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    LoginUserMutation,
    LoginUserMutationVariables,
    LoginUserProps<TChildProps>
  >(LoginUserDocument, {
    alias: "withLoginUser",
    ...operationOptions
  });
}

export function useLoginUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    LoginUserMutation,
    LoginUserMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    LoginUserMutation,
    LoginUserMutationVariables
  >(LoginUserDocument, baseOptions);
}
export type LoginUserMutationHookResult = ReturnType<
  typeof useLoginUserMutation
>;
export type LoginUserMutationResult = ApolloReactCommon.MutationResult<
  LoginUserMutation
>;
export type LoginUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
  LoginUserMutation,
  LoginUserMutationVariables
>;
export const UpdateCoinBalanceDocument = gql`
  mutation UpdateCoinBalance($input: UpdateCoinBalanceInput!) {
    updateCoinBalance(input: $input) {
      success
    }
  }
`;
export type UpdateCoinBalanceMutationFn = ApolloReactCommon.MutationFunction<
  UpdateCoinBalanceMutation,
  UpdateCoinBalanceMutationVariables
>;
export type UpdateCoinBalanceComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    UpdateCoinBalanceMutation,
    UpdateCoinBalanceMutationVariables
  >,
  "mutation"
>;

export const UpdateCoinBalanceComponent = (
  props: UpdateCoinBalanceComponentProps
) => (
  <ApolloReactComponents.Mutation<
    UpdateCoinBalanceMutation,
    UpdateCoinBalanceMutationVariables
  >
    mutation={UpdateCoinBalanceDocument}
    {...props}
  />
);

export type UpdateCoinBalanceProps<
  TChildProps = {}
> = ApolloReactHoc.MutateProps<
  UpdateCoinBalanceMutation,
  UpdateCoinBalanceMutationVariables
> &
  TChildProps;
export function withUpdateCoinBalance<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UpdateCoinBalanceMutation,
    UpdateCoinBalanceMutationVariables,
    UpdateCoinBalanceProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    UpdateCoinBalanceMutation,
    UpdateCoinBalanceMutationVariables,
    UpdateCoinBalanceProps<TChildProps>
  >(UpdateCoinBalanceDocument, {
    alias: "withUpdateCoinBalance",
    ...operationOptions
  });
}

export function useUpdateCoinBalanceMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateCoinBalanceMutation,
    UpdateCoinBalanceMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateCoinBalanceMutation,
    UpdateCoinBalanceMutationVariables
  >(UpdateCoinBalanceDocument, baseOptions);
}
export type UpdateCoinBalanceMutationHookResult = ReturnType<
  typeof useUpdateCoinBalanceMutation
>;
export type UpdateCoinBalanceMutationResult = ApolloReactCommon.MutationResult<
  UpdateCoinBalanceMutation
>;
export type UpdateCoinBalanceMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateCoinBalanceMutation,
  UpdateCoinBalanceMutationVariables
>;
export const UpdateConstantsDocument = gql`
  mutation UpdateConstants($input: UpdateConstantInput!) {
    updateConstants(input: $input) {
      constant {
        id
        name
        value
      }
    }
  }
`;
export type UpdateConstantsMutationFn = ApolloReactCommon.MutationFunction<
  UpdateConstantsMutation,
  UpdateConstantsMutationVariables
>;
export type UpdateConstantsComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    UpdateConstantsMutation,
    UpdateConstantsMutationVariables
  >,
  "mutation"
>;

export const UpdateConstantsComponent = (
  props: UpdateConstantsComponentProps
) => (
  <ApolloReactComponents.Mutation<
    UpdateConstantsMutation,
    UpdateConstantsMutationVariables
  >
    mutation={UpdateConstantsDocument}
    {...props}
  />
);

export type UpdateConstantsProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  UpdateConstantsMutation,
  UpdateConstantsMutationVariables
> &
  TChildProps;
export function withUpdateConstants<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UpdateConstantsMutation,
    UpdateConstantsMutationVariables,
    UpdateConstantsProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    UpdateConstantsMutation,
    UpdateConstantsMutationVariables,
    UpdateConstantsProps<TChildProps>
  >(UpdateConstantsDocument, {
    alias: "withUpdateConstants",
    ...operationOptions
  });
}

export function useUpdateConstantsMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateConstantsMutation,
    UpdateConstantsMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateConstantsMutation,
    UpdateConstantsMutationVariables
  >(UpdateConstantsDocument, baseOptions);
}
export type UpdateConstantsMutationHookResult = ReturnType<
  typeof useUpdateConstantsMutation
>;
export type UpdateConstantsMutationResult = ApolloReactCommon.MutationResult<
  UpdateConstantsMutation
>;
export type UpdateConstantsMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateConstantsMutation,
  UpdateConstantsMutationVariables
>;
export const ConstantsDocument = gql`
  query Constants($search: String, $limit: Int, $offset: Int) {
    constants(search: $search, limit: $limit, offset: $offset) {
      totalCount
      nodes {
        id
        name
        value
      }
    }
  }
`;
export type ConstantsComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    ConstantsQuery,
    ConstantsQueryVariables
  >,
  "query"
>;

export const ConstantsComponent = (props: ConstantsComponentProps) => (
  <ApolloReactComponents.Query<ConstantsQuery, ConstantsQueryVariables>
    query={ConstantsDocument}
    {...props}
  />
);

export type ConstantsProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  ConstantsQuery,
  ConstantsQueryVariables
> &
  TChildProps;
export function withConstants<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    ConstantsQuery,
    ConstantsQueryVariables,
    ConstantsProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    ConstantsQuery,
    ConstantsQueryVariables,
    ConstantsProps<TChildProps>
  >(ConstantsDocument, {
    alias: "withConstants",
    ...operationOptions
  });
}

export function useConstantsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ConstantsQuery,
    ConstantsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<ConstantsQuery, ConstantsQueryVariables>(
    ConstantsDocument,
    baseOptions
  );
}
export function useConstantsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ConstantsQuery,
    ConstantsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<ConstantsQuery, ConstantsQueryVariables>(
    ConstantsDocument,
    baseOptions
  );
}

export type ConstantsQueryHookResult = ReturnType<typeof useConstantsQuery>;
export type ConstantsQueryResult = ApolloReactCommon.QueryResult<
  ConstantsQuery,
  ConstantsQueryVariables
>;
export const TeamDocument = gql`
  query Team($id: Int!) {
    team(id: $id) {
      id
      name
      description
    }
  }
`;
export type TeamComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<TeamQuery, TeamQueryVariables>,
  "query"
> &
  ({ variables: TeamQueryVariables; skip?: boolean } | { skip: boolean });

export const TeamComponent = (props: TeamComponentProps) => (
  <ApolloReactComponents.Query<TeamQuery, TeamQueryVariables>
    query={TeamDocument}
    {...props}
  />
);

export type TeamProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  TeamQuery,
  TeamQueryVariables
> &
  TChildProps;
export function withTeam<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    TeamQuery,
    TeamQueryVariables,
    TeamProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    TeamQuery,
    TeamQueryVariables,
    TeamProps<TChildProps>
  >(TeamDocument, {
    alias: "withTeam",
    ...operationOptions
  });
}

export function useTeamQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<TeamQuery, TeamQueryVariables>
) {
  return ApolloReactHooks.useQuery<TeamQuery, TeamQueryVariables>(
    TeamDocument,
    baseOptions
  );
}
export function useTeamLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TeamQuery,
    TeamQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<TeamQuery, TeamQueryVariables>(
    TeamDocument,
    baseOptions
  );
}

export type TeamQueryHookResult = ReturnType<typeof useTeamQuery>;
export type TeamQueryResult = ApolloReactCommon.QueryResult<
  TeamQuery,
  TeamQueryVariables
>;
export const CreateTeamDocument = gql`
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) {
      team {
        id
      }
    }
  }
`;
export type CreateTeamMutationFn = ApolloReactCommon.MutationFunction<
  CreateTeamMutation,
  CreateTeamMutationVariables
>;
export type CreateTeamComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    CreateTeamMutation,
    CreateTeamMutationVariables
  >,
  "mutation"
>;

export const CreateTeamComponent = (props: CreateTeamComponentProps) => (
  <ApolloReactComponents.Mutation<
    CreateTeamMutation,
    CreateTeamMutationVariables
  >
    mutation={CreateTeamDocument}
    {...props}
  />
);

export type CreateTeamProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  CreateTeamMutation,
  CreateTeamMutationVariables
> &
  TChildProps;
export function withCreateTeam<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateTeamMutation,
    CreateTeamMutationVariables,
    CreateTeamProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateTeamMutation,
    CreateTeamMutationVariables,
    CreateTeamProps<TChildProps>
  >(CreateTeamDocument, {
    alias: "withCreateTeam",
    ...operationOptions
  });
}

export function useCreateTeamMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateTeamMutation,
    CreateTeamMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateTeamMutation,
    CreateTeamMutationVariables
  >(CreateTeamDocument, baseOptions);
}
export type CreateTeamMutationHookResult = ReturnType<
  typeof useCreateTeamMutation
>;
export type CreateTeamMutationResult = ApolloReactCommon.MutationResult<
  CreateTeamMutation
>;
export type CreateTeamMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateTeamMutation,
  CreateTeamMutationVariables
>;
export const UpdateTeamDocument = gql`
  mutation UpdateTeam($input: UpdateTeamInput!) {
    updateTeam(input: $input) {
      team {
        id
      }
    }
  }
`;
export type UpdateTeamMutationFn = ApolloReactCommon.MutationFunction<
  UpdateTeamMutation,
  UpdateTeamMutationVariables
>;
export type UpdateTeamComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    UpdateTeamMutation,
    UpdateTeamMutationVariables
  >,
  "mutation"
>;

export const UpdateTeamComponent = (props: UpdateTeamComponentProps) => (
  <ApolloReactComponents.Mutation<
    UpdateTeamMutation,
    UpdateTeamMutationVariables
  >
    mutation={UpdateTeamDocument}
    {...props}
  />
);

export type UpdateTeamProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  UpdateTeamMutation,
  UpdateTeamMutationVariables
> &
  TChildProps;
export function withUpdateTeam<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UpdateTeamMutation,
    UpdateTeamMutationVariables,
    UpdateTeamProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    UpdateTeamMutation,
    UpdateTeamMutationVariables,
    UpdateTeamProps<TChildProps>
  >(UpdateTeamDocument, {
    alias: "withUpdateTeam",
    ...operationOptions
  });
}

export function useUpdateTeamMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateTeamMutation,
    UpdateTeamMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateTeamMutation,
    UpdateTeamMutationVariables
  >(UpdateTeamDocument, baseOptions);
}
export type UpdateTeamMutationHookResult = ReturnType<
  typeof useUpdateTeamMutation
>;
export type UpdateTeamMutationResult = ApolloReactCommon.MutationResult<
  UpdateTeamMutation
>;
export type UpdateTeamMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateTeamMutation,
  UpdateTeamMutationVariables
>;
export const TeamsDocument = gql`
  query Teams($search: String, $limit: Int, $offset: Int) {
    teams(search: $search, limit: $limit, offset: $offset) {
      totalCount
      nodes {
        id
        name
        departments {
          id
          name
        }
      }
    }
  }
`;
export type TeamsComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<TeamsQuery, TeamsQueryVariables>,
  "query"
>;

export const TeamsComponent = (props: TeamsComponentProps) => (
  <ApolloReactComponents.Query<TeamsQuery, TeamsQueryVariables>
    query={TeamsDocument}
    {...props}
  />
);

export type TeamsProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  TeamsQuery,
  TeamsQueryVariables
> &
  TChildProps;
export function withTeams<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    TeamsQuery,
    TeamsQueryVariables,
    TeamsProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    TeamsQuery,
    TeamsQueryVariables,
    TeamsProps<TChildProps>
  >(TeamsDocument, {
    alias: "withTeams",
    ...operationOptions
  });
}

export function useTeamsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    TeamsQuery,
    TeamsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<TeamsQuery, TeamsQueryVariables>(
    TeamsDocument,
    baseOptions
  );
}
export function useTeamsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    TeamsQuery,
    TeamsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<TeamsQuery, TeamsQueryVariables>(
    TeamsDocument,
    baseOptions
  );
}

export type TeamsQueryHookResult = ReturnType<typeof useTeamsQuery>;
export type TeamsQueryResult = ApolloReactCommon.QueryResult<
  TeamsQuery,
  TeamsQueryVariables
>;
export const CreateUserTeamDocument = gql`
  mutation CreateUserTeam($input: CreateUserTeamInput!) {
    createUserTeam(input: $input) {
      userTeam {
        id
      }
    }
  }
`;
export type CreateUserTeamMutationFn = ApolloReactCommon.MutationFunction<
  CreateUserTeamMutation,
  CreateUserTeamMutationVariables
>;
export type CreateUserTeamComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    CreateUserTeamMutation,
    CreateUserTeamMutationVariables
  >,
  "mutation"
>;

export const CreateUserTeamComponent = (
  props: CreateUserTeamComponentProps
) => (
  <ApolloReactComponents.Mutation<
    CreateUserTeamMutation,
    CreateUserTeamMutationVariables
  >
    mutation={CreateUserTeamDocument}
    {...props}
  />
);

export type CreateUserTeamProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  CreateUserTeamMutation,
  CreateUserTeamMutationVariables
> &
  TChildProps;
export function withCreateUserTeam<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateUserTeamMutation,
    CreateUserTeamMutationVariables,
    CreateUserTeamProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateUserTeamMutation,
    CreateUserTeamMutationVariables,
    CreateUserTeamProps<TChildProps>
  >(CreateUserTeamDocument, {
    alias: "withCreateUserTeam",
    ...operationOptions
  });
}

export function useCreateUserTeamMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateUserTeamMutation,
    CreateUserTeamMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateUserTeamMutation,
    CreateUserTeamMutationVariables
  >(CreateUserTeamDocument, baseOptions);
}
export type CreateUserTeamMutationHookResult = ReturnType<
  typeof useCreateUserTeamMutation
>;
export type CreateUserTeamMutationResult = ApolloReactCommon.MutationResult<
  CreateUserTeamMutation
>;
export type CreateUserTeamMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateUserTeamMutation,
  CreateUserTeamMutationVariables
>;
export const DeleteUserTeamDocument = gql`
  mutation DeleteUserTeam($input: DeleteUserTeamInput!) {
    deleteUserTeam(input: $input) {
      isDeleted
    }
  }
`;
export type DeleteUserTeamMutationFn = ApolloReactCommon.MutationFunction<
  DeleteUserTeamMutation,
  DeleteUserTeamMutationVariables
>;
export type DeleteUserTeamComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    DeleteUserTeamMutation,
    DeleteUserTeamMutationVariables
  >,
  "mutation"
>;

export const DeleteUserTeamComponent = (
  props: DeleteUserTeamComponentProps
) => (
  <ApolloReactComponents.Mutation<
    DeleteUserTeamMutation,
    DeleteUserTeamMutationVariables
  >
    mutation={DeleteUserTeamDocument}
    {...props}
  />
);

export type DeleteUserTeamProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  DeleteUserTeamMutation,
  DeleteUserTeamMutationVariables
> &
  TChildProps;
export function withDeleteUserTeam<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    DeleteUserTeamMutation,
    DeleteUserTeamMutationVariables,
    DeleteUserTeamProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    DeleteUserTeamMutation,
    DeleteUserTeamMutationVariables,
    DeleteUserTeamProps<TChildProps>
  >(DeleteUserTeamDocument, {
    alias: "withDeleteUserTeam",
    ...operationOptions
  });
}

export function useDeleteUserTeamMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    DeleteUserTeamMutation,
    DeleteUserTeamMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    DeleteUserTeamMutation,
    DeleteUserTeamMutationVariables
  >(DeleteUserTeamDocument, baseOptions);
}
export type DeleteUserTeamMutationHookResult = ReturnType<
  typeof useDeleteUserTeamMutation
>;
export type DeleteUserTeamMutationResult = ApolloReactCommon.MutationResult<
  DeleteUserTeamMutation
>;
export type DeleteUserTeamMutationOptions = ApolloReactCommon.BaseMutationOptions<
  DeleteUserTeamMutation,
  DeleteUserTeamMutationVariables
>;
export const UserDetailDocument = gql`
  query UserDetail($id: Int!) {
    user(id: $id) {
      id
      fullName
      email
      teams {
        id
        name
      }
    }
  }
`;
export type UserDetailComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<
    UserDetailQuery,
    UserDetailQueryVariables
  >,
  "query"
> &
  ({ variables: UserDetailQueryVariables; skip?: boolean } | { skip: boolean });

export const UserDetailComponent = (props: UserDetailComponentProps) => (
  <ApolloReactComponents.Query<UserDetailQuery, UserDetailQueryVariables>
    query={UserDetailDocument}
    {...props}
  />
);

export type UserDetailProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  UserDetailQuery,
  UserDetailQueryVariables
> &
  TChildProps;
export function withUserDetail<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UserDetailQuery,
    UserDetailQueryVariables,
    UserDetailProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    UserDetailQuery,
    UserDetailQueryVariables,
    UserDetailProps<TChildProps>
  >(UserDetailDocument, {
    alias: "withUserDetail",
    ...operationOptions
  });
}

export function useUserDetailQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserDetailQuery,
    UserDetailQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<UserDetailQuery, UserDetailQueryVariables>(
    UserDetailDocument,
    baseOptions
  );
}
export function useUserDetailLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserDetailQuery,
    UserDetailQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    UserDetailQuery,
    UserDetailQueryVariables
  >(UserDetailDocument, baseOptions);
}

export type UserDetailQueryHookResult = ReturnType<typeof useUserDetailQuery>;
export type UserDetailQueryResult = ApolloReactCommon.QueryResult<
  UserDetailQuery,
  UserDetailQueryVariables
>;
export const UserDocument = gql`
  query User($id: Int!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;
export type UserComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<UserQuery, UserQueryVariables>,
  "query"
> &
  ({ variables: UserQueryVariables; skip?: boolean } | { skip: boolean });

export const UserComponent = (props: UserComponentProps) => (
  <ApolloReactComponents.Query<UserQuery, UserQueryVariables>
    query={UserDocument}
    {...props}
  />
);

export type UserProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  UserQuery,
  UserQueryVariables
> &
  TChildProps;
export function withUser<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UserQuery,
    UserQueryVariables,
    UserProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    UserQuery,
    UserQueryVariables,
    UserProps<TChildProps>
  >(UserDocument, {
    alias: "withUser",
    ...operationOptions
  });
}

export function useUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<UserQuery, UserQueryVariables>
) {
  return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions
  );
}
export function useUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserQuery,
    UserQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions
  );
}

export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserQueryResult = ApolloReactCommon.QueryResult<
  UserQuery,
  UserQueryVariables
>;
export const CreateUserDocument = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      user {
        id
      }
    }
  }
`;
export type CreateUserMutationFn = ApolloReactCommon.MutationFunction<
  CreateUserMutation,
  CreateUserMutationVariables
>;
export type CreateUserComponentProps = Omit<
  ApolloReactComponents.MutationComponentOptions<
    CreateUserMutation,
    CreateUserMutationVariables
  >,
  "mutation"
>;

export const CreateUserComponent = (props: CreateUserComponentProps) => (
  <ApolloReactComponents.Mutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >
    mutation={CreateUserDocument}
    {...props}
  />
);

export type CreateUserProps<TChildProps = {}> = ApolloReactHoc.MutateProps<
  CreateUserMutation,
  CreateUserMutationVariables
> &
  TChildProps;
export function withCreateUser<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    CreateUserMutation,
    CreateUserMutationVariables,
    CreateUserProps<TChildProps>
  >
) {
  return ApolloReactHoc.withMutation<
    TProps,
    CreateUserMutation,
    CreateUserMutationVariables,
    CreateUserProps<TChildProps>
  >(CreateUserDocument, {
    alias: "withCreateUser",
    ...operationOptions
  });
}

export function useCreateUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateUserMutation,
    CreateUserMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CreateUserDocument, baseOptions);
}
export type CreateUserMutationHookResult = ReturnType<
  typeof useCreateUserMutation
>;
export type CreateUserMutationResult = ApolloReactCommon.MutationResult<
  CreateUserMutation
>;
export type CreateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateUserMutation,
  CreateUserMutationVariables
>;
export const UsersDocument = gql`
  query Users($search: String, $limit: Int, $offset: Int) {
    users(search: $search, limit: $limit, offset: $offset) {
      totalCount
      nodes {
        id
        email
        fullName
        teams {
          id
          name
        }
      }
    }
  }
`;
export type UsersComponentProps = Omit<
  ApolloReactComponents.QueryComponentOptions<UsersQuery, UsersQueryVariables>,
  "query"
>;

export const UsersComponent = (props: UsersComponentProps) => (
  <ApolloReactComponents.Query<UsersQuery, UsersQueryVariables>
    query={UsersDocument}
    {...props}
  />
);

export type UsersProps<TChildProps = {}> = ApolloReactHoc.DataProps<
  UsersQuery,
  UsersQueryVariables
> &
  TChildProps;
export function withUsers<TProps, TChildProps = {}>(
  operationOptions?: ApolloReactHoc.OperationOption<
    TProps,
    UsersQuery,
    UsersQueryVariables,
    UsersProps<TChildProps>
  >
) {
  return ApolloReactHoc.withQuery<
    TProps,
    UsersQuery,
    UsersQueryVariables,
    UsersProps<TChildProps>
  >(UsersDocument, {
    alias: "withUsers",
    ...operationOptions
  });
}

export function useUsersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    baseOptions
  );
}
export function useUsersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UsersQuery,
    UsersQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<UsersQuery, UsersQueryVariables>(
    UsersDocument,
    baseOptions
  );
}

export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersQueryResult = ApolloReactCommon.QueryResult<
  UsersQuery,
  UsersQueryVariables
>;
