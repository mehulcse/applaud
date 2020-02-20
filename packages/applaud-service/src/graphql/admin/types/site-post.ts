import SitePost from "../../../services/internal/db/models/site-post";
import { GraphQLContext } from "../../../types/graphql-context";
import { SiteService } from "../../../services/internal/services/site-service";
import Site from "../../../services/internal/db/models/site";

export default {
  SitePost: {
    site: async (
      sitePost: SitePost,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Site | null> => {
      if (!sitePost.siteId) {
        return null;
      }
      const site = await new SiteService(context).getById(sitePost.siteId);
      return site;
    }
  }
};
