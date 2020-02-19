import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { CoinReceivedService } from "../../../services/internal/services/coin-received-service";
import CoinReceived from "../../../services/internal/db/models/coin-received";

interface Args extends PaginationArgs {
  allocatedToUserId?: number;
  allocatedByUserId?:number;
}

export default {
  Query: {
    applaud: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<CoinReceived>> => {
      const coinReceivedService = new CoinReceivedService(context);
      const nodes = await coinReceivedService.getAll(args);
      const totalCount = await coinReceivedService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
