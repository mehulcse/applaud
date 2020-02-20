import { GraphQLContext } from "../../../types/graphql-context";
import { DepartmentService } from "../../../services/internal/services/department-service";

interface CreateDepartmentInput {
  name: string;
  description: string;
}

interface Args {
  input: CreateDepartmentInput;
}

export default {
  Mutation: {
    createDepartment: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const department = await new DepartmentService(context).create(args.input);
      return {
        department
      };
    }
  }
};
