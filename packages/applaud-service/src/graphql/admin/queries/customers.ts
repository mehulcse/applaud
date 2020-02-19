import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import Customer from "../../../services/internal/db/models/customer";
import { GraphQLContext } from "../../../types/graphql-context";
import { CustomerService } from "../../../services/internal/services/customer-service";

interface Args extends PaginationArgs {
  search: string;
  partnerId?: number;
  ids?: number[];
}

export default {
  Query: {
    customers: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Customer>> => {
      const customerService = new CustomerService(context);
      const nodes = await customerService.getAll(args);
      const totalCount = await customerService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
