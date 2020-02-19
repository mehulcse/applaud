import { buildPageInfo, Connection, PaginationArgs } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { RoleService } from "../../../services/internal/services/role-service";
import Role from "../../../services/internal/db/models/role";

interface Args extends PaginationArgs {}

export default {
  Query: {
    roles: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Role>> => {
      const roleService = new RoleService(context);
      const nodes = await roleService.getAll({});
      const totalCount = await roleService.getCount({});

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
