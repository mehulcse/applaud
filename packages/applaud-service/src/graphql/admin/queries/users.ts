import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { UserService } from "../../../services/internal/services/user-service";
import User from "../../../services/internal/db/models/user";
import { ROLES } from "../../../constants";

interface Args extends PaginationArgs {
  search: string;
}

export default {
  Query: {
    users: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<User>> => {
      const userService = new UserService(context);
      const userArags = {
        ...args,
        roleIds: [ROLES.ADMIN, ROLES.SUPER_ADMIN]
      };
      const nodes = await userService.getAll(userArags);
      const totalCount = await userService.getCount(userArags);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
