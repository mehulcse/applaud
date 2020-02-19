import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerService } from "../../../services/internal/services/partner-service";
import Partner from "../../../services/internal/db/models/partner";

interface Args {
  id: number;
}

export default {
  Query: {
    partner: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Partner | null> => {
      const partner = await new PartnerService(context).getById(args.id);
      return partner;
    }
  }
};
