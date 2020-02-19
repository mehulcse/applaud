import { VendorService } from "../../../services/internal/services/vendor-service";
import { GraphQLContext } from "../../../types/graphql-context";
import Vendor from "../../../services/internal/db/models/vendor";

interface Args {
  id: number;
}

export default {
  Query: {
    vendor: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Vendor | null> => {
      const vendor = await new VendorService(context).getById(args.id);
      return vendor;
    }
  }
};
