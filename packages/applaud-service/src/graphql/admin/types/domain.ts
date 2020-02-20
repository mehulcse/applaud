import Domain, {
  DOMAIN_STATUS,
  DomainStatus
} from "../../../services/internal/db/models/domain";
import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import DomainCategory from "../../../services/internal/db/models/domain-category";
import { GraphQLContext } from "../../../types/graphql-context";
import {
  DomainCategoryService,
  DomainCategoryOptions
} from "../../../services/internal/services/domain-category-service";

export default {
  Domain: {
    domainCategories: async (
      domain: Domain,
      args: PaginationArgs,
      { context }: GraphQLContext
    ): Promise<Connection<DomainCategory>> => {
      const domainCategoryService = new DomainCategoryService(context);

      const options: DomainCategoryOptions = {
        domainIds: [domain.id]
      };

      const nodes = await domainCategoryService.getAll(options);
      const totalCount = await domainCategoryService.getCount(options);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    },
    status: async (
      domain: Domain,
      _args: any
    ): Promise<DomainStatus | null> => {
      const domainStatus = Object.entries(DOMAIN_STATUS).find(
        arr => arr[1].id === domain.status
      );
      if (domainStatus) {
        return domainStatus[1];
      }
      throw new Error("Invalid status for domain.");
    }
  }
};
