import { GraphQLContext } from "../../../types/graphql-context";
import User from "../../../services/internal/db/models/user";
import { UserService } from "../../../services/internal/services/user-service";

interface Args {
  id: number;
}

export default {
  Query: {
    user: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<User | null> => {
      const user = await new UserService(context).getById(args.id);
      return user;
    }
  }
};
