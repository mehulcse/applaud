import { GraphQLContext } from "../../../types/graphql-context";
import { SitePostService } from "../../../services/internal/services/site-post-service";

interface UpdateSitePostInput {
  sitePostId: number;
  title?: string;
  content?: string;
}

interface UpdateSitePostInputArgs {
  input: UpdateSitePostInput;
}

export default {
  Mutation: {
    updateSitePost: async (
      _parent: any,
      args: UpdateSitePostInputArgs,
      { context }: GraphQLContext
    ) => {
      const { sitePostId, ...updates } = args.input;

      const updatedSitePost = await new SitePostService(context).update(
        sitePostId,
        updates
      );

      return { sitePost: updatedSitePost };
    }
  }
};
