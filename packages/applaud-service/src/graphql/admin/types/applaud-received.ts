import { GraphQLContext } from "../../../types/graphql-context";
import { UserService } from "../../../services/internal/services/user-service";
import Applaud from "../../../services/internal/db/models/coin-received";
import User from "../../../services/internal/db/models/user";

export default {
  Applaud: {
    allocatedToUser: async (
      applaud: Applaud,
      _args: any,
      { context }: GraphQLContext
    ): Promise<User | null> => {
      const user = await new UserService(context).getById(
        applaud.allocatedToUserId
      );
      return user;
    }
  }
};
