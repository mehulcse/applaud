import { GraphQLContext } from "../../../types/graphql-context";
import { CoinBalanceService } from "../../../services/internal/services/coin-balance-service";

interface UpdateCoinBalanceInput {
  quantity: number;
}

interface UpdateCoinBalanceInputArgs {
  input: UpdateCoinBalanceInput;
}

export default {
  Mutation: {
    updateCoinBalance: async (
      _: any,
      args: UpdateCoinBalanceInputArgs,
      { context }: GraphQLContext
    ) => {
      const { quantity } = args.input;

      const updatedCoinBalance = await new CoinBalanceService(
        context
      ).bulkAllocation(quantity);
      return updatedCoinBalance;
    }
  }
};
