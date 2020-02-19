import { GraphQLContext } from "../../../types/graphql-context";
import { UserService } from "../../../services/internal/services/user-service";

interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
}

interface Args {
  input: CreateUserInput;
}

export default {
  Mutation: {
    createUser: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const user = await new UserService(context).create(args.input);
      return {
        user
      };
    }
  }
};
