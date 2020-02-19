import { GraphQLContext } from "../../../types/graphql-context";
import { DOMAIN_STATUS } from "../../../services/internal/db/models/domain";

interface DomainStatus {
  id: string;
  name: string;
}

export default {
  Query: {
    domainStatuses: async (
      _parent: any,
      _args: any,
      _context: GraphQLContext
    ): Promise<DomainStatus[]> => {
      return Object.entries(DOMAIN_STATUS).map(item => item[1]);
    }
  }
};
