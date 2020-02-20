import { GraphQLContext } from "../../../types/graphql-context";
import { UserTeamService } from "../../../services/internal/services/user-team-service";

interface CreateUserTeamInput {
  userId: number;
  teamId: number;
}

interface Args {
  input: CreateUserTeamInput;
}

export default {
  Mutation: {
    createUserTeam: async (
      _parent: any,
      args: Args,
      { context }: GraphQLContext
    ) => {
      const userTeam = await new UserTeamService(context).create(args.input);
      return {
        userTeam
      };
    }
  }
};
