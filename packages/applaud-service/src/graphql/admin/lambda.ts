import { ApolloServer } from "apollo-server-lambda";
import resolvers from "./resolvers";
import Config from "../../config";
import schema from "./schema.graphql";
import { ApolloContextCookiePlugin } from "../apollo-context-cookie-plugin";
import { handleContext } from "../auth-helper";

export function getAdminServer() {
  const isProduction = Config.isProduction();

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: handleContext,
    playground: !isProduction,
    tracing: false,
    introspection: !isProduction,
    plugins: [ApolloContextCookiePlugin]
  });

  return server;
}
