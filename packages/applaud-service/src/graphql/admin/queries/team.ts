import { GraphQLContext } from "../../../types/graphql-context";
import Team from "../../../services/internal/db/models/teams";
import { TeamService } from "../../../services/internal/services/team-service";

interface Args {
  id: number;
}

export default {
  Query: {
    team: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Team | null> => {
      const team = await new TeamService(context).getById(args.id);
      return team;
    }
  }
};
