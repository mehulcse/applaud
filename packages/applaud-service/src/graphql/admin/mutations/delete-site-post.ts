import { GraphQLContext } from "../../../types/graphql-context";
import { SitePostService } from "../../../services/internal/services/site-post-service";

interface DeleteSitePostInput {
  sitePostId: number;
}

interface Args {
  input: DeleteSitePostInput;
}

export default {
  Mutation: {
    deleteSitePost: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      await new SitePostService(context).delete(args.input.sitePostId);

      return {
        isDeleted: true
      };
    }
  }
};
