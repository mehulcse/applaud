import { GraphQLContext } from "../../../types/graphql-context";
import Department from "../../../services/internal/db/models/department";
import { DepartmentService } from "../../../services/internal/services/department-service";

interface Args {
  id: number;
}

export default {
  Query: {
    department: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Department | null> => {
      const department = await new DepartmentService(context).getById(args.id);
      return department;
    }
  }
};
