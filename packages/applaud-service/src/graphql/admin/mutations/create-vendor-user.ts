import { GraphQLContext } from "../../../types/graphql-context";
import { VendorUserService } from "../../../services/internal/services/vendor-user-service";

interface CreateVendorUserInput {
  firstName: string;
  lastName: string;
  email: string;
  vendorId: number;
}

interface Args {
  input: CreateVendorUserInput;
}

export default {
  Mutation: {
    createVendorUser: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const vendorUser = await new VendorUserService(context).create(
        args.input
      );

      return {
        vendorUser
      };
    }
  }
};
