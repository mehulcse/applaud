import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { DepartmentService } from "../../../services/internal/services/department-service";
import Department from "../../../services/internal/db/models/department";

interface Args extends PaginationArgs {
  search?: string;
}

export default {
  Query: {
    department: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Department>> => {
      const departmentService = new DepartmentService(context);
      const nodes = await departmentService.getAll(args);
      const totalCount = await departmentService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
