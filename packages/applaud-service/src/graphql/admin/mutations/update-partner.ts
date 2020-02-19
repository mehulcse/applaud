import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerService } from "../../../services/internal/services/partner-service";

interface UpdatePartnerInput {
  partnerId: number;
  name?: string;
}

interface UpdatePartnerInputArgs {
  input: UpdatePartnerInput;
}

export default {
  Mutation: {
    updatePartner: async (
      _: any,
      args: UpdatePartnerInputArgs,
      { context }: GraphQLContext
    ) => {
      const { partnerId, ...updates } = args.input;
      const partner = await new PartnerService(context).update(
        partnerId,
        updates
      );

      return { partner };
    }
  }
};
