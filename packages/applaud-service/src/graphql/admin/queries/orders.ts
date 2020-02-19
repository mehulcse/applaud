import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import Order from "../../../services/internal/db/models/order";
import { GraphQLContext } from "../../../types/graphql-context";
import { OrderService } from "../../../services/internal/services/order-service";

interface Args extends PaginationArgs {
  customerIds?: number[];
  statusIds?: string[];
}

export default {
  Query: {
    orders: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Order>> => {
      const orderService = new OrderService(context);
      const nodes = await orderService.getAll(args);
      const totalCount = await orderService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
