import { GraphQLContext } from "../../../types/graphql-context";
import User from "../../../services/internal/db/models/user";
import { UserRoleService } from "../../../services/internal/services/user-role-service";
import UserRole from "../../../services/internal/db/models/user-role";

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
    fullName: (user: User) => {
      return `${user.firstName} ${user.lastName}`;
    }
  }
};
