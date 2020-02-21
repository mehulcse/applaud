import { GraphQLContext } from "../../../types/graphql-context";
import { DepartmentTeamService } from "../../../services/internal/services/department-team-service";

interface DeleteDepartmentTeamInput {
  id: number;
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
      const { id } = args.input;
      const response = await new DepartmentTeamService(context).delete(id);
      return response;
    }
  }
};
