import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { UserService } from "../../../services/internal/services/user-service";
import User from "../../../services/internal/db/models/user";

interface Args extends PaginationArgs {
  search?: string;
  roleIds?: string[];
  ids?: number[];
}

export default {
  Query: {
    users: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<User>> => {
      const userService = new UserService(context);
      const nodes = await userService.getAll(args);
      const totalCount = await userService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
