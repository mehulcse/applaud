import { getLogger } from "../../../logger";
import { GraphQLContext } from "../../../types/graphql-context";
import { AUTH_COOKIE_NAME } from "../../../constants";

const logger = getLogger("logout-user.ts");

export default {
  Mutation: {
    logoutUser: async (
      _parent: any,
      _args: any,
      context: GraphQLContext
    ): Promise<{ isLoggedOut: boolean }> => {
      logger.debug("Logging user out.");
      context.cookiesToRemove = [AUTH_COOKIE_NAME];
      return { isLoggedOut: true };
    }
  }
};
