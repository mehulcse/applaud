import User from "../../../services/internal/db/models/user";
import { GraphQLContext } from "../../../types/graphql-context";
import { UserService } from "../../../services/internal/services/user-service";
import { VendorService } from "../../../services/internal/services/vendor-service";
import VendorUser from "../../../services/internal/db/models/vendor-user";
import Vendor from "../../../services/internal/db/models/vendor";

export default {
  VendorUser: {
    user: async (
      vendorUser: VendorUser,
      _args: any,
      { context }: GraphQLContext
    ): Promise<User | null> => {
      const user = await new UserService(context).getById(vendorUser.userId);
      return user;
    },
    addedByUser: async (
      vendorUser: VendorUser,
      _args: any,
      { context }: GraphQLContext
    ): Promise<User | null> => {
      const user = await new UserService(context).getById(
        vendorUser.addedByUserId
      );
      return user;
    },
    vendor: async (
      vendorUser: VendorUser,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Vendor | null> => {
      const vendor = await new VendorService(context).getById(
        vendorUser.vendorId
      );
      return vendor;
    }
  }
};
