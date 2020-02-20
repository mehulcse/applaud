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
  viewer?: Maybe<User>;
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
};

export type QueryTeamArgs = {
  id: Scalars["Int"];
};

export type QueryTeamsArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  sort?: Maybe<TeamsSort>;
  search?: Maybe<Scalars["String"]>;
};

export type QueryUserArgs = {
  id: Scalars["Int"];
};

export type QueryUsersArgs = {
  limit?: Maybe<Scalars["Int"]>;
  offset?: Maybe<Scalars["Int"]>;
  sort?: Maybe<UsersSort>;
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
    { __typename?: "User" } & Pick<
      User,
      "id" | "firstName" | "lastName" | "email"
    >
  >;
};

export type LogoutUserMutationVariables = {};

export type LogoutUserMutation = { __typename?: "Mutation" } & {
  logoutUser: { __typename?: "LogoutUserResponse" } & Pick<
    LogoutUserResponse,
    "isLoggedOut"
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

export const TeamsForSelectorDocument = gql`
  query TeamsForSelector($search: String, $ids: [Int!]) {
    teams(search: $search) {
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
    users(search: $search) {
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
      id
      firstName
      lastName
      email
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
