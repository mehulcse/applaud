import { GraphQLContext } from "../../../types/graphql-context";

export default {
  Query: {
    viewer: async (_parent: any, _args: any, context: GraphQLContext) => {
      if (!context.context.viewer) {
        return null;
      }
      return context.context.viewer.user;
    }
  }
};
