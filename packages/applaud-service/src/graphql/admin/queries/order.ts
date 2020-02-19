import Order from "../../../services/internal/db/models/order";
import { GraphQLContext } from "../../../types/graphql-context";
import { OrderService } from "../../../services/internal/services/order-service";

interface Args {
  id: number;
}

export default {
  Query: {
    order: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Order | null> => {
      const order = await new OrderService(context).getById(args.id);
      return order;
    }
  }
};
