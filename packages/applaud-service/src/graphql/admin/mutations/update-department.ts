import { GraphQLContext } from "../../../types/graphql-context";
import { DepartmentService } from "../../../services/internal/services/department-service";

interface UpdateDepartmentInput {
  departmentId: number;
  name?: string;
  description?: string;
}

interface UpdateDepartmentInputArgs {
  input: UpdateDepartmentInput;
}

export default {
  Mutation: {
    updateDepartment: async (
      _: any,
      args: UpdateDepartmentInputArgs,
      { context }: GraphQLContext
    ) => {
      const { departmentId, ...updates } = args.input;

      const updatedDepartment = await new DepartmentService(context).update(
        departmentId,
        updates
      );

      return { department: updatedDepartment };
    }
  }
};
