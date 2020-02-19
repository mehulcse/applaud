import { GraphQLContext } from "../../../types/graphql-context";
import { CategoryService } from "../../../services/internal/services/category-service";

interface CreateCategoryInput {
  name: string;
}

interface Args {
  input: CreateCategoryInput;
}

export default {
  Mutation: {
    createCategory: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const category = await new CategoryService(context).create(args.input);

      return {
        category
      };
    }
  }
};
