import { GraphQLContext } from "../../../types/graphql-context";
import { CoinBalanceService } from "../../../services/internal/services/coin-balance-service";

interface UpdateApplaudBalanceInput {
  balance: number;
  coinBalanceId: number;
}

interface UpdateApplaudBalanceInputArgs {
  input: UpdateApplaudBalanceInput;
}

export default {
  Mutation: {
    updateApplaudBalance: async (
      _: any,
      args: UpdateApplaudBalanceInputArgs,
      { context }: GraphQLContext
    ) => {
      const { coinBalanceId, ...updates } = args.input;
      const applaudBalance = await new CoinBalanceService(context).update(coinBalanceId, updates);
      return {
        applaudBalance
      };
    }
  }
};
