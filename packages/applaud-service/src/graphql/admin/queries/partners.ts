import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import Partner from "../../../services/internal/db/models/partner";
import { GraphQLContext } from "../../../types/graphql-context";
import { PartnerService } from "../../../services/internal/services/partner-service";

interface Args extends PaginationArgs {
  search?: string;
}

export default {
  Query: {
    partners: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Partner>> => {
      const partnerService = new PartnerService(context);

      const nodes = await partnerService.getAll(args);
      const totalCount = await partnerService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
