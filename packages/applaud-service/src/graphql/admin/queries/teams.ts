import { Connection, PaginationArgs, buildPageInfo } from "../../helpers";
import { GraphQLContext } from "../../../types/graphql-context";
import { TeamService } from "../../../services/internal/services/team-service";
import Team from "../../../services/internal/db/models/teams";

interface Args extends PaginationArgs {
  search?: string;
  ids?: number[];
}

export default {
  Query: {
    teams: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ): Promise<Connection<Team>> => {
      const teamService = new TeamService(context);
      const nodes = await teamService.getAll(args);
      const totalCount = await teamService.getCount(args);

      return {
        totalCount,
        nodes,
        pageInfo: buildPageInfo(totalCount, args)
      };
    }
  }
};
