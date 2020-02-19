import { VendorService } from "../../../services/internal/services/vendor-service";
import { GraphQLContext } from "../../../types/graphql-context";

interface UpdateVendorInput {
  vendorId: number;
  name?: string;
}

interface UpdateVendorInputArgs {
  input: UpdateVendorInput;
}

export default {
  Mutation: {
    updateVendor: async (
      _: any,
      args: UpdateVendorInputArgs,
      { context }: GraphQLContext
    ) => {
      const { vendorId, ...updates } = args.input;
      const vendor = await new VendorService(context).update(vendorId, updates);

      return { vendor };
    }
  }
};
