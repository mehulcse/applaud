import { GraphQLContext } from "../types/graphql-context";
import { AppContext } from "../services/auth/app-context";
import { AUTH_COOKIE_NAME } from "../constants";
import { getViewer } from "../services/auth/viewer";
import { Context } from "aws-lambda";
import { getLogger } from "../logger";

interface HandleContextOptions {
  event: any;
  context: Context;
}

export async function handleContext({
  event,
  context
}: HandleContextOptions): Promise<GraphQLContext> {
  const logger = getLogger("auth helper");
  const cookies = event.headers["Cookie"];
  const cookieArray = cookies
    ? cookies.split(";").map((x: any) => ({
        name: x.split("=")[0].trim(),
        value: x.split("=")[1].trim()
      }))
    : [];
  const authCookie = cookieArray.find((x: any) => x.name === AUTH_COOKIE_NAME);
  logger.debug(authCookie);
  const appContext: AppContext = {
    requestId: context.awsRequestId,
    viewer: null
  };
  if (authCookie) {
    appContext.viewer = await getViewer({
      jwtToken: authCookie.value,
      requestId: "new"
    });
  }
  return {
    context: appContext
  };
}
