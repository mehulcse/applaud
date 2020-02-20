import log4js, { Logger } from "log4js";
import Config from "./config";

log4js.addLayout("json", function(config) {
  return function(logEvent) {
    return JSON.stringify(logEvent) + config.separator;
  };
});
if (!Config.getIsLocal()) {
  log4js.configure({
    appenders: {
      out: { type: "stdout", layout: { type: "json", separator: "," } }
    },
    categories: {
      default: { appenders: ["out"], level: "info" }
    }
  });
}

export function getLogger(name?: string): Logger {
  const logger = log4js.getLogger(name);
  logger.level = "debug";
  return logger;
}
