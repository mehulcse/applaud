import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { SiteService } from "../../../services/internal/services/site-service";
import Site from "../../../services/internal/db/models/site";

interface Args extends PaginationArgs {
  search: string;
}

export default {
  Query: {
    sites: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Site>> => {
      const siteService = new SiteService(context);
      const nodes = await siteService.getAll(args);
      const totalCount = await siteService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
