import { importSchema } from "graphql-import"; // For Docker Compose
import { ApolloServer } from "apollo-server-express";
import resolvers from "./resolvers";
import { GraphQLContext } from "../../types/graphql-context";
import Config from "../../config";
import { RequestWithContext } from "../../types/request-with-context";
import { AppContext } from "../../services/auth/app-context";
import { join } from "path";

export async function getServer() {
  const isProduction = Config.isProduction();

  const schema = importSchema(join(__dirname, "./schema.graphql")); //For Docker Compose
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, res }): Promise<GraphQLContext> => {
      return {
        request: req,
        response: res,
        context: (req as RequestWithContext).context as AppContext
      };
    },
    playground: !isProduction,
    tracing: false,
    introspection: !isProduction
  });

  return server;
}
