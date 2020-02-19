import Customer from "../../../services/internal/db/models/customer";
import Partner from "../../../services/internal/db/models/partner";
import { PartnerService } from "../../../services/internal/services/partner-service";
import { GraphQLContext } from "../../../types/graphql-context";

export default {
  Customer: {
    partner: async (
      customer: Customer,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Partner | null> => {
      const partner = await new PartnerService(context).getById(
        customer.partnerId
      );
      return partner;
    }
  }
};
