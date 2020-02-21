import { GraphQLContext } from "../../../types/graphql-context";
import { DepartmentTeamService } from "../../../services/internal/services/department-team-service";

interface DeleteDepartmentTeamInput {
  teamId: number;
  departmentId: number;
}

interface DeleteDepartmentTeamInputArgs {
  input: DeleteDepartmentTeamInput;
}

export default {
  Mutation: {
    deleteDepartmentTeam: async (
      _: any,
      args: DeleteDepartmentTeamInputArgs,
      { context }: GraphQLContext
    ) => {
      const response = await new DepartmentTeamService(context).delete(
        args.input
      );
      return response;
    }
  }
};
