import Customer from "../../../services/internal/db/models/customer";
import { GraphQLContext } from "../../../types/graphql-context";
import { CustomerService } from "../../../services/internal/services/customer-service";

interface Args {
  id: number;
}

export default {
  Query: {
    customer: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Customer | null> => {
      const customer = await new CustomerService(context).getById(args.id);
      return customer;
    }
  }
};
