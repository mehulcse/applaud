import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import SitePost from "../../../services/internal/db/models/site-post";
import { GraphQLContext } from "../../../types/graphql-context";
import {
  SitePostService,
  SitePostSort
} from "../../../services/internal/services/site-post-service";

interface Args extends PaginationArgs<SitePostSort> {
  siteIds?: string[];
  search?: string;
  statusIds?: string[];
}

export default {
  Query: {
    sitePosts: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<SitePost>> => {
      const sitePostService = new SitePostService(context);

      const nodes = await sitePostService.getAll(args);
      const totalCount = await sitePostService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
