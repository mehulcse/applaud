import { GraphQLContext } from "../../../types/graphql-context";
import { DomainCategoryService } from "../../../services/internal/services/domain-category-service";

interface CreateDomainCategoryInput {
  domainId: string;
  categoryId: number;
}

interface Args {
  input: CreateDomainCategoryInput;
}

export default {
  Mutation: {
    createDomainCategory: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const domainCategory = await new DomainCategoryService(context).create(
        args.input
      );

      return {
        domainCategory
      };
    }
  }
};
