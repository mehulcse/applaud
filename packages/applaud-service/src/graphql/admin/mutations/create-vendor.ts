import { GraphQLContext } from "../../../types/graphql-context";
import { VendorService } from "../../../services/internal/services/vendor-service";

interface CreateVendorInput {
  name: string;
  partnerId?: number;
}

interface Args {
  input: CreateVendorInput;
}

export default {
  Mutation: {
    createVendor: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const vendor = await new VendorService(context).create(args.input);

      return {
        vendor
      };
    }
  }
};
