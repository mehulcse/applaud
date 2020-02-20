import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import bugsnagExpress from "@bugsnag/plugin-express";
import { getLogger } from "./logger";
import Config from "./config";
import authMiddleware from "./auth-middleware";
import bodyParser from "body-parser";
import helmet from "helmet";
import { getServer as getAdminServer } from "./graphql/admin";
// import { getServer as getPartnerServer } from "./graphql/partner";
// import { getServer as getWorkerServer } from "./graphql/worker";
import {
  middleware as gracefulShutdownMiddleware,
  gracefulExitHandler
} from "./utilities/graceful-shutdown";
import { getDb } from "./services/internal/db";
// import { bugsnagClient } from "./services/bugsnag";
// import Config from "./config";

const PORT = process.env.PORT || 3000;

const logger = getLogger("api.js");

export async function start() {
  // bugsnagClient.use(bugsnagExpress);
  // const bugsnagMiddleware = bugsnagClient.getPlugin("express");

  const corsOrigin = Config.getCorsOrigin();

  const app = express();
  // app.use(bugsnagMiddleware.requestHandler);
  app.use(helmet());

  const corsOptions = {
    credentials: true,
    origin: corsOrigin
  };
  app.options("*", cors(corsOptions));
  await getDb();

  app.get("/health", cors(corsOptions), (_req, res) => {
    res.send({ ok: true }).status(200);
  });

  app.use(gracefulShutdownMiddleware(app));
  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(authMiddleware);

  const adminApiServer = await getAdminServer();
  // const partnerApiServer = await getPartnerServer();
  // const workerApiServer = await getWorkerServer();

  adminApiServer.applyMiddleware({
    app,
    cors: true,
    path: "/local/admin/graphql"
  });
  // partnerApiServer.applyMiddleware({
  //   app,
  //   cors: corsOptions,
  //   path: "/partner/graphql"
  // });
  // workerApiServer.applyMiddleware({
  //   app,
  //   cors: corsOptions,
  //   path: "/worker/graphql"
  // });

  // app.use(bugsnagMiddleware.errorHandler);

  const server = app.listen({ port: PORT }, () => {
    logger.debug(`Server ready, listening on ${PORT}...`);
  });

  if (!Config.getIsLocal()) {
    process.on("SIGTERM", () => {
      logger.debug("SIGTERM received, exiting...");
      gracefulExitHandler(app, server);
    });

    process.on("SIGINT", () => {
      logger.debug("SIGINT received, exiting...");
      gracefulExitHandler(app, server);
    });
  }
}
