import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerUserService } from "../../../services/internal/services/partner-user-service";

interface CreatePartnerUserInput {
  firstName: string;
  lastName: string;
  email: string;
  partnerId: number;
  isAdmin: boolean;
}

interface Args {
  input: CreatePartnerUserInput;
}

export default {
  Mutation: {
    createPartnerUser: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const partnerUser = await new PartnerUserService(context).create(
        args.input
      );

      return {
        partnerUser
      };
    }
  }
};
