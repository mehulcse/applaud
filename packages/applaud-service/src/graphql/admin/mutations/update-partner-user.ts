import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerUserService } from "../../../services/internal/services/partner-user-service";

interface UpdatePartnerUserInput {
  partnerUserId: number;
  isActive?: boolean;
  isAdmin?: boolean;
}

interface UpdatePartnerUserInputArgs {
  input: UpdatePartnerUserInput;
}

export default {
  Mutation: {
    updatePartnerUser: async (
      _: any,
      args: UpdatePartnerUserInputArgs,
      { context }: GraphQLContext
    ) => {
      const { partnerUserId, ...updates } = args.input;

      const updatedPartnerUser = await new PartnerUserService(context).update(
        partnerUserId,
        updates
      );

      return { partnerUser: updatedPartnerUser };
    }
  }
};
