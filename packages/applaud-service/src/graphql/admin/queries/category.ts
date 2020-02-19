import { GraphQLContext } from "../../../types/graphql-context";
import Category from "../../../services/internal/db/models/category";
import { CategoryService } from "../../../services/internal/services/category-service";

interface Args {
  id: number;
}

export default {
  Query: {
    category: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Category | null> => {
      const category = await new CategoryService(context).getById(args.id);
      return category;
    }
  }
};
