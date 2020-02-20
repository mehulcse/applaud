import { GraphQLContext } from "../../../types/graphql-context";
import { CoinReceivedService } from "../../../services/internal/services/coin-received-service";

interface CreateApplaudInput {
  balance: number;
  allocatedToUserId: number;
  allocatedByUserId: number;
  message?: string;
  type: string;
}

interface Args {
  input: CreateApplaudInput;
}

export default {
  Mutation: {
    createApplaud: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const applaud = await new CoinReceivedService(context).create(args.input);
      return {
        applaud
      };
    }
  }
};
