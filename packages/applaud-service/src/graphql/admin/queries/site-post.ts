import { GraphQLContext } from "../../../types/graphql-context";
import { SitePostService } from "../../../services/internal/services/site-post-service";
import SitePost from "../../../services/internal/db/models/site-post";

interface Args {
  sitePostId: number;
}

export default {
  Query: {
    sitePost: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<SitePost | null> => {
      const sitePost = await new SitePostService(context).getById(
        args.sitePostId
      );
      return sitePost;
    }
  }
};
