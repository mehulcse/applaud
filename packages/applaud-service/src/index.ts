import "source-map-support/register";
import { getLogger } from "./logger";
import config from "./config";
import { migrate } from "./services/internal/db";

const logger = getLogger("index.js");

async function start() {
  const targetProcess = config.getProcess();
  // console.log(process.env);
  logger.info(`Starting "${targetProcess}" (pid ${process.pid})`);
  if (!config.getIsLocal()) {
    logger.info("Executing any pending database migrations");
    await migrate();
  }
  if (targetProcess === "api") {
    const api = await import("./api");
    await api.start();
  } else if (targetProcess === "worker") {
    const worker = await import("./worker");
    await worker.start();
  } else if (targetProcess === "migrate") {
    logger.debug("Migrating DB");
    await migrate();
    process.exit(0);
  } else if (targetProcess === "repl") {
    const cli = await import("./repl");
    await cli.runCli();
  } else {
    logger.error("❌ Unknown process, exiting...");
  }
}

start();
