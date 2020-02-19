import { GraphQLContext } from "../../../types/graphql-context";
import { DepartmentTeamService } from "../../../services/internal/services/department-team-service";

interface CreateDepartmentTeamInput {
  departmentId: number;
  teamId: number;
}

interface Args {
  input: CreateDepartmentTeamInput;
}

export default {
  Mutation: {
    createDepartmentTeam: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const departmentTeam = await new DepartmentTeamService(context).create(args.input);
      return {
        departmentTeam
      };
    }
  }
};
