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
  allocatedByUserId: Scalars["Int"];
  message?: Maybe<Scalars["String"]>;
  type: Scalars["String"];
  createdAt: Scalars["DateTime"];
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
  user: User;
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
      nodes: Array<{ __typename?: "User" } & Pick<User, "id">>;
    }
  >;
};

export type AuthManagerQueryVariables = {};

export type AuthManagerQuery = { __typename?: "Query" } & {
  viewer: Maybe<
    { __typename?: "Viewer" } & Pick<Viewer, "userRoles" | "isAdmin"> & {
        user: { __typename?: "User" } & Pick<
          User,
          "id" | "firstName" | "lastName" | "email"
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
              | "id"
              | "allocatedByUserId"
              | "allocatedToUserId"
              | "message"
              | "type"
              | "createdAt"
            >
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

export type TeamQueryVariables = {
  id: Scalars["Int"];
};

export type TeamQuery = { __typename?: "Query" } & {
  team: Maybe<{ __typename?: "Team" } & Pick<Team, "id" | "name">>;
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
          Array<{ __typename?: "Team" } & Pick<Team, "id" | "name">>
        >;
      }
  >;
};

export type UserDetailQueryVariables = {
  id: Scalars["Int"];
};

export type UserDetailQuery = { __typename?: "Query" } & {
  user: Maybe<
    { __typename?: "User" } & Pick<
      User,
      "id" | "firstName" | "lastName" | "email"
    >
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
        nodes: Array<{ __typename?: "User" } & Pick<User, "id" | "email">>;
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
        allocatedByUserId
        allocatedToUserId
        message
        type
        createdAt
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
export const TeamDocument = gql`
  query Team($id: Int!) {
    team(id: $id) {
      id
      name
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
export const UserDetailDocument = gql`
  query UserDetail($id: Int!) {
    user(id: $id) {
      id
      firstName
      lastName
      email
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
