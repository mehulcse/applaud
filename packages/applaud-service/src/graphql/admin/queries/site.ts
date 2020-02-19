import { GraphQLContext } from "../../../types/graphql-context";
import { SiteService } from "../../../services/internal/services/site-service";
import Site from "../../../services/internal/db/models/site";

interface Args {
  siteId: string;
}

export default {
  Query: {
    site: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Site | null> => {
      const site = await new SiteService(context).getById(args.siteId);
      return site;
    }
  }
};
