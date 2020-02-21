import { GraphQLContext } from "../../../types/graphql-context";
import { UserTeamService } from "../../../services/internal/services/user-team-service";

interface DeleteUserTeamInput {
  teamId: number;
  userId: number;
}

interface DeleteUserTeamInputArgs {
  input: DeleteUserTeamInput;
}

export default {
  Mutation: {
    deleteUserTeam: async (
      _: any,
      args: DeleteUserTeamInputArgs,
      { context }: GraphQLContext
    ) => {
      const response = await new UserTeamService(context).delete(args.input);
      return response;
    }
  }
};
