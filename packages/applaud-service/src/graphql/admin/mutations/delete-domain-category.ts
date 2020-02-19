import { GraphQLContext } from "../../../types/graphql-context";
import { DomainCategoryService } from "../../../services/internal/services/domain-category-service";

interface DeleteDomainCategoryInput {
  id: number;
}

interface Args {
  input: DeleteDomainCategoryInput;
}

export default {
  Mutation: {
    deleteDomainCategory: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      await new DomainCategoryService(context).delete(args.input.id);

      return {
        isDeleted: true
      };
    }
  }
};
