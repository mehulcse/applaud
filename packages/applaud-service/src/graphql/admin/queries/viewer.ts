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
      return context.context.viewer.user;
    }
  }
};
