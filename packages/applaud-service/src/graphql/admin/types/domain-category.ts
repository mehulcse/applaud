import DomainCategory from "../../../services/internal/db/models/domain-category";
import Category from "../../../services/internal/db/models/category";
import Domain from "../../../services/internal/db/models/domain";
import { GraphQLContext } from "../../../types/graphql-context";
import { CategoryService } from "../../../services/internal/services/category-service";
import { DomainService } from "../../../services/internal/services/domain-service";

export default {
  DomainCategory: {
    category: async (
      domainCategory: DomainCategory,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Category | null> => {
      const category = await new CategoryService(context).getById(
        domainCategory.categoryId
      );
      return category;
    },
    domain: async (
      domainCategory: DomainCategory,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Domain | null> => {
      const domain = await new DomainService(context).getById(
        domainCategory.domainId
      );
      return domain;
    }
  }
};
