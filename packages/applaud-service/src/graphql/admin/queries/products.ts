import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { ProductService } from "../../../services/internal/services/product-service";
import Product from "../../../services/internal/db/models/product";

interface Args extends PaginationArgs {
  search: string;
}

export default {
  Query: {
    products: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Product>> => {
      const productService = new ProductService(context);
      const nodes = await productService.getAll({});
      const totalCount = await productService.getCount({});

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
