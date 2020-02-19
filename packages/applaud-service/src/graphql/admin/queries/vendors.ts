import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import Vendor from "../../../services/internal/db/models/vendor";
import { VendorService } from "../../../services/internal/services/vendor-service";

interface Args extends PaginationArgs {
  search: string;
}

export default {
  Query: {
    vendors: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Vendor>> => {
      const vendorService = new VendorService(context);

      const nodes = await vendorService.getAll({ ...args, partnerId: null });
      const totalCount = await vendorService.getCount({
        ...args,
        partnerId: null
      });

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
