import { GraphQLContext } from "../../../types/graphql-context";
import { UserTeamService } from "../../../services/internal/services/user-team-service";

interface DeleteUserTeamInput {
  id: number;
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
      const { id } = args.input;
      const response = await new UserTeamService(context).delete(id);
      return response;
    }
  }
};
