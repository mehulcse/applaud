import { GraphQLContext } from "../../../types/graphql-context";
import { SiteService } from "../../../services/internal/services/site-service";

interface CreateSiteInput {
  id: string;
}

interface Args {
  input: CreateSiteInput;
}

export default {
  Mutation: {
    createSite: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const site = await new SiteService(context).create(args.input);

      return {
        site
      };
    }
  }
};
