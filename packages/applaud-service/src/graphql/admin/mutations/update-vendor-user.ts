import { GraphQLContext } from "../../../types/graphql-context";
import { VendorUserService } from "../../../services/internal/services/vendor-user-service";
interface UpdateVendorUserInput {
  vendorUserId: number;
  isActive: boolean;
}

interface UpdateVendorUserInputArgs {
  input: UpdateVendorUserInput;
}

export default {
  Mutation: {
    updateVendorUser: async (
      _: any,
      args: UpdateVendorUserInputArgs,
      { context }: GraphQLContext
    ) => {
      const { vendorUserId, ...updates } = args.input;
      const vendorUser = await new VendorUserService(context).update(
        vendorUserId,
        updates
      );

      return { vendorUser };
    }
  }
};
