import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import Category from "../../../services/internal/db/models/category";
import { GraphQLContext } from "../../../types/graphql-context";
import { CategoryService } from "../../../services/internal/services/category-service";

interface Args extends PaginationArgs {
  search?: string;
  includeInactive?: boolean;
}

export default {
  Query: {
    categories: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Category>> => {
      const categoryService = new CategoryService(context);
      const nodes = await categoryService.getAll(args);
      const totalCount = await categoryService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
