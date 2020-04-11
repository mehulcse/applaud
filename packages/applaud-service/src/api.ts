import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { getLogger } from "./logger";
import Config from "./config";
import authMiddleware from "./auth-middleware";
import bodyParser from "body-parser";
import helmet from "helmet";
import { getServer as getAdminServer } from "./graphql/admin";
import {
  middleware as gracefulShutdownMiddleware,
  gracefulExitHandler
} from "./utilities/graceful-shutdown";
import { getDb } from "./services/internal/db";

const PORT = process.env.PORT || 3000;

const logger = getLogger("api.js");

export async function start() {
  const corsOrigin = Config.getCorsOrigin();

  const app = express();
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

  adminApiServer.applyMiddleware({
    app,
    cors: corsOptions,
    path: "/admin/graphql"
  });

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
