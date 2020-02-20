import bugsnag from "@bugsnag/js";
import Config from "../../config";
import { getLogger } from "../../logger";

export const bugsnagClient = bugsnag({
  apiKey: Config.getBugsnagApiKey(),
  appType: Config.getProcess(),
  autoNotify: !Config.getIsLocal(),
  logger: Config.getIsLocal() ? null : getLogger("bugsnag"),
  releaseStage: Config.getEnvironment()
});
