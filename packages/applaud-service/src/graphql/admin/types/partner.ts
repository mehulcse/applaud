import PartnerProduct from "../../../services/internal/db/models/partner-product";
import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { PartnerProductService } from "../../../services/internal/services/partner-product-service";
import { GraphQLContext } from "../../../types/graphql-context";
import PartnerUser from "../../../services/internal/db/models/partner-user";
import {
  PartnerUserService,
  PartnerUsersOptions
} from "../../../services/internal/services/partner-user-service";
import Partner from "../../../services/internal/db/models/partner";
import { PartnerAvailableProductService } from "../../../services/internal/services/partner-available-product-service";
import PartnerAvailableProduct from "../../../services/internal/db/models/partner-available-product";

interface Args extends PaginationArgs {
  includeInactive?: boolean;
}

export default {
  Partner: {
    partnerUsers: async (
      partner: Partner,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<PartnerUser>> => {
      const partnerUserService = new PartnerUserService(context);

      const options: PartnerUsersOptions = {
        partnerId: partner.id,
        includeInactive: args.includeInactive
      };

      const nodes = await partnerUserService.getAll(options);
      const totalCount = await partnerUserService.getCount(options);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    },
    partnerProducts: async (
      partner: Partner,
      _args: any,
      { context }: GraphQLContext
    ): Promise<PartnerProduct[]> => {
      const partnerProducts = await new PartnerProductService(context).getAll({
        partnerId: partner.id
      });
      return partnerProducts;
    },
    partnerAvailableProducts: async (
      partner: Partner,
      _args: any,
      { context }: GraphQLContext
    ): Promise<PartnerAvailableProduct[]> => {
      const partnerAvailableProducts = await new PartnerAvailableProductService(
        context
      ).getAll({
        partnerId: partner.id
      });
      return partnerAvailableProducts;
    }
  }
};
