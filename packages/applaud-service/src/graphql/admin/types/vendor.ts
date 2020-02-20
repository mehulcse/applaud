import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import Partner from "../../../services/internal/db/models/partner";
import { PartnerService } from "../../../services/internal/services/partner-service";
import VendorUser from "../../../services/internal/db/models/vendor-user";
import {
  VendorUserService,
  VendorUsersOptions
} from "../../../services/internal/services/vendor-user-service";
import Vendor from "../../../services/internal/db/models/vendor";

interface Args extends PaginationArgs {
  includeInactive?: boolean;
}

export default {
  Vendor: {
    partner: async (
      vendor: Vendor,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Partner | null> => {
      if (!vendor.partnerId) {
        return null;
      }
      const partner = await new PartnerService(context).getById(
        vendor.partnerId
      );
      return partner;
    },
    vendorUsers: async (
      vendor: Vendor,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<VendorUser>> => {
      const vendorUserService = new VendorUserService(context);

      const options: VendorUsersOptions = {
        vendorId: vendor.id,
        includeInactive: args.includeInactive
      };

      const nodes = await vendorUserService.getAll(options);
      const totalCount = await vendorUserService.getCount(options);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
