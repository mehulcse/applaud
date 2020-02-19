import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import Domain from "../../../services/internal/db/models/domain";
import { GraphQLContext } from "../../../types/graphql-context";
import { DomainService } from "../../../services/internal/services/domain-service";

interface Args extends PaginationArgs {
  search?: string;
  statusIds?: string[];
  categoryIds?: number[];
}

export default {
  Query: {
    domains: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Domain>> => {
      const domainService = new DomainService(context);
      const nodes = await domainService.getAll(args);
      const totalCount = await domainService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
