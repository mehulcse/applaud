import { GraphQLContext } from "../../../types/graphql-context";
import { getLogger } from "../../../logger";

export default {
  Query: {
    viewer: async (_parent: any, _args: any, context: GraphQLContext) => {
      const logger = getLogger("viewer");
      logger.debug(context);
      if (!context.context.viewer) {
        return null;
      }
      return {
        isAdmin: context.context.viewer.isAdmin,
        userRoles: context.context.viewer.userRoles,
        user: context.context.viewer.user
      };
    }
  }
};
