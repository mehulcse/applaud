import { GraphQLContext } from "../../../types/graphql-context";
import { TeamService } from "../../../services/internal/services/team-service";

interface CreateTeamInput {
  name: string;
  description: string;
}

interface Args {
  input: CreateTeamInput;
}

export default {
  Mutation: {
    createTeam: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const team = await new TeamService(context).create(args.input);
      return {
        team
      };
    }
  }
};
