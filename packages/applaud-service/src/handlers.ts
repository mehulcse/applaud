import "source-map-support/register";
import {
  APIGatewayProxyResult,
  APIGatewayProxyEvent,
  Context,
  Callback
  // APIGatewayProxyCallback
} from "aws-lambda";
// import { getAdminHandler } from "./graphql/admin/lambda";
// import { getDb } from "./services/internal/db";
// import { getPartnerServer } from "./graphql/partner/lambda";
import { getAdminServer } from "./graphql/admin/lambda";
// import { getWorkerServer } from "./graphql/worker/lambda";
import { getDb } from "./services/internal/db";

const adminServer = getAdminServer();
// const partnerServer = getPartnerServer();
// const workerServer = getWorkerServer();

export async function health(): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        ok: true
      },
      null,
      2
    )
  };
}

function runApollo(
  event: APIGatewayProxyEvent,
  context: Context,
  apollo: (
    event: APIGatewayProxyEvent,
    context: Context,
    callback: Callback<APIGatewayProxyResult>
  ) => void
) {
  return new Promise((resolve, reject) => {
    const callback = (error: any, body: any) =>
      error ? reject(error) : resolve(body);
    apollo(event, context, callback);
  });
}

export async function adminGraphQL(event: any, context: any) {
  await getDb();
  const apollo = adminServer.createHandler({
    cors: { origin: true, credentials: true }
  });

  const response = await runApollo(event, context, apollo as any);
  return response;
}

// export async function partnerGraphQL(event: any, context: any) {
//   await getDb();
//   const apollo = partnerServer.createHandler({
//     cors: { origin: "*", credentials: true }
//   });
//
//   const response = await runApollo(event, context, apollo as any);
//   return response;
// }
//
// export async function workerGraphQL(event: any, context: any) {
//   await getDb();
//   const apollo = workerServer.createHandler({
//     cors: { origin: "*", credentials: true }
//   });
//
//   const response = await runApollo(event, context, apollo as any);
//   return response;
// }
