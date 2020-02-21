import { GraphQLContext } from "../../../types/graphql-context";
import User from "../../../services/internal/db/models/user";
import { UserRoleService } from "../../../services/internal/services/user-role-service";
import UserRole from "../../../services/internal/db/models/user-role";
import { TeamService } from "../../../services/internal/services/team-service";
import Team from "../../../services/internal/db/models/teams";

export default {
  User: {
    userRoles: async (
      user: User,
      _args: any,
      { context }: GraphQLContext
    ): Promise<UserRole[]> => {
      const userRoles = await new UserRoleService(context).getAll({
        userId: user.id
      });
      return userRoles;
    },
    teams: async (
      user: User,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Team[]> => {
      const teams = await new TeamService(context).getAll({ userId: user.id });
      return teams;
    },
    fullName: (user: User) => {
      return `${user.firstName} ${user.lastName}`;
    }
  }
};
