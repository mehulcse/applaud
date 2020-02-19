import { GraphQLContext } from "../../../types/graphql-context";
import { ORDER_STATUS } from "../../../services/internal/db/models/order";

interface OrderStatus {
  id: string;
  name: string;
}

export default {
  Query: {
    orderStatuses: async (
      _parent: any,
      _args: any,
      _context: GraphQLContext
    ): Promise<OrderStatus[]> => {
      const statuses = Object.entries(ORDER_STATUS).map(item => item[1]);
      return statuses;
    }
  }
};
