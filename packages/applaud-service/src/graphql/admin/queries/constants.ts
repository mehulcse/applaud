import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { ConstantService } from "../../../services/internal/services/constant-service";
import Constant from "../../../services/internal/db/models/constant";

interface Args extends PaginationArgs {
  search?: string;
}

export default {
  Query: {
    constants: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Constant>> => {
      const constantService = new ConstantService(context);
      const nodes = await constantService.getAll(args);
      const totalCount = await constantService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
