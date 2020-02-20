import { GraphQLContext } from "../types/graphql-context";
import { AppContext } from "../services/auth/app-context";
import { AUTH_COOKIE_NAME, PARTNER_COOKIE_NAME } from "../constants";
import { getViewer } from "../services/auth/viewer";
import { Context } from "aws-lambda";

interface HandleContextOptions {
  event: any;
  context: Context;
}

export async function handleContext({
  event,
  context
}: HandleContextOptions): Promise<GraphQLContext> {
  const cookies = event.headers["Cookie"];
  const cookieArray = cookies ? cookies.split(";").map((x: any) => ({
    name: x.split("=")[0].trim(),
    value: x.split("=")[1].trim()
  })) : [];
  const authCookie = cookieArray.find((x: any) => x.name === AUTH_COOKIE_NAME);
  const partnerCookie = cookieArray.find(
    (x: any) => x.name === PARTNER_COOKIE_NAME
  );
  const appContext: AppContext = {
    requestId: context.awsRequestId,
    viewer: null,
    partnerId: !!partnerCookie ? parseInt(partnerCookie.value, 10) : null,
    vendorId: null
  };
  if (authCookie) {
    appContext.viewer = await getViewer({
      jwtToken: authCookie.value,
      partnerId: appContext.partnerId || undefined,
      vendorId: undefined,
      requestId: "new"
    });
  }
  return {
    context: appContext
  };
}
