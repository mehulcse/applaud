import { GraphQLContext } from "../../../types/graphql-context";
import { UserRoleService } from "../../../services/internal/services/user-role-service";

interface CreateUserRoleInput {
  userId: number;
  roleId: string;
}

interface Args {
  input: CreateUserRoleInput;
}

export default {
  Mutation: {
    createUserRole: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const userRole = await new UserRoleService(context).create(args.input);

      return {
        userRole
      };
    }
  }
};
