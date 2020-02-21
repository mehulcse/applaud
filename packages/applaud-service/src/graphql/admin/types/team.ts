import { GraphQLContext } from "../../../types/graphql-context";
import Team from "../../../services/internal/db/models/teams";
import { DepartmentService } from "../../../services/internal/services/department-service";
import Department from "../../../services/internal/db/models/department";

export default {
  Team: {
    departments: async (
      team: Team,
      _args: any,
      { context }: GraphQLContext
    ): Promise<Department[]> => {
      const departments = await new DepartmentService(context).getAll({
        teamId: team.id
      });
      return departments;
    }
  }
};
