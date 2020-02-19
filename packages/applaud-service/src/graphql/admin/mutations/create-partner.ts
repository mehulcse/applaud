import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerService } from "../../../services/internal/services/partner-service";

interface CreatePartnerInput {
  name: string;
}

interface Args {
  input: CreatePartnerInput;
}

export default {
  Mutation: {
    createPartner: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const partner = await new PartnerService(context).create(args.input);

      return {
        partner
      };
    }
  }
};
