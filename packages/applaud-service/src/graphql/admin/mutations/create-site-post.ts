import { GraphQLContext } from "../../../types/graphql-context";
import { SitePostService } from "../../../services/internal/services/site-post-service";

interface CreateSitePostInput {
  siteId?: string;
  title: string;
  content: string;
}

interface Args {
  input: CreateSitePostInput;
}

export default {
  Mutation: {
    createSitePost: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const sitePost = await new SitePostService(context).create(args.input);

      return {
        sitePost
      };
    }
  }
};
