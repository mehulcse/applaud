import { GraphQLContext } from "../../../types/graphql-context";
import { TeamService } from "../../../services/internal/services/team-service";

interface UpdateTeamInput {
  teamId: number;
  name?: string;
  description?: string;
}

interface UpdateTeamInputArgs {
  input: UpdateTeamInput;
}

export default {
  Mutation: {
    updateTeam: async (
      _: any,
      args: UpdateTeamInputArgs,
      { context }: GraphQLContext
    ) => {
      const { teamId, ...updates } = args.input;

      const updatedTeam = await new TeamService(context).update(
        teamId,
        updates
      );

      return { team: updatedTeam };
    }
  }
};
