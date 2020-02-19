import { GraphQLContext } from "../../../types/graphql-context";
import { CategoryService } from "../../../services/internal/services/category-service";

interface UpdateCategoryInput {
  categoryId: number;
  isActive?: boolean;
}

interface UpdateCategoryInputArgs {
  input: UpdateCategoryInput;
}

export default {
  Mutation: {
    updateCategory: async (
      _: any,
      args: UpdateCategoryInputArgs,
      { context }: GraphQLContext
    ) => {
      const { categoryId, ...updates } = args.input;

      const updatedCategory = await new CategoryService(context).update(
        categoryId,
        updates
      );

      return { category: updatedCategory };
    }
  }
};
