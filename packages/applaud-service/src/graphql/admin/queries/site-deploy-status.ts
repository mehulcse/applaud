import { GraphQLContext } from "../../../types/graphql-context";
import {
  SITE_DEPLOY_STATUS,
  SiteDeployStatus
} from "../../../services/internal/db/models/site";

export default {
  Query: {
    siteDeployStatuses: async (
      _parent: any,
      _args: any,
      _context: GraphQLContext
    ): Promise<SiteDeployStatus[]> => {
      const statuses = Object.entries(SITE_DEPLOY_STATUS).map(item => item[1]);
      return statuses;
    }
  }
};
