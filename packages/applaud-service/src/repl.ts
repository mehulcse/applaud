import { getLogger } from "./logger";
import { ExecuteWorkflowJobHandler } from "./services/jobs/handlers/execute-workflow";

const logger = getLogger("repl");

export const runCli = async () => {
  logger.debug("Running REPL");
  await new ExecuteWorkflowJobHandler().enqueue({ workflowId: 2 });
};
