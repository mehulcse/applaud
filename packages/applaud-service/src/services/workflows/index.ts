import { getLogger } from "../../logger";
import { PRODUCTS } from "../../constants";
import { CustomV1Workflow } from "./custom-v1";
import { WORKFLOW_TYPES } from "./workflow-types";
import { getSystemContext } from "../auth/helpers";
import { PartnerProductService } from "../internal/services/partner-product-service";
import { WorkflowService } from "../internal/services/workflow-service";
import { WORKFLOW_STATUS } from "../internal/db/models/workflow";
import { OrderService } from "../internal/services/order-service";

const logger = getLogger();

export const executeWorkflow = async (workflowId: number) => {
  const systemContext = await getSystemContext();
  const workflow = await new WorkflowService(systemContext).getById(workflowId);
  if (!workflow) {
    throw new Error(`Unable to find Workflow #${workflowId}.`);
  }

  if (workflow.status === WORKFLOW_STATUS.NEW.id) {
    await new WorkflowService(systemContext).update(workflow.id, {
      status: WORKFLOW_STATUS.IN_PROGRESS.id
    });
  }

  switch (workflow.type) {
    case WORKFLOW_TYPES.CUSTOM_V1:
      await new CustomV1Workflow(workflowId).execute();
      break;
    default:
      logger.error(
        `Unable to find Workflow Definition for "${workflow.type}" for Workflow #${workflowId}.`
      );
      return;
  }
};

export const getWorkflowTypeForOrder = async (orderId: number) => {
  const systemContext = await getSystemContext();
  const order = await new OrderService(systemContext).getById(orderId);
  if (!order) {
    throw new Error(`Unable to find Order #${orderId}.`);
  }

  const partnerProduct = await new PartnerProductService(systemContext).getById(
    order.partnerProductId
  );

  if (!partnerProduct) {
    throw new Error(
      `Unable to find Partner Product #${order.partnerProductId} for Order #${order.id}.`
    );
  }

  switch (partnerProduct.productId) {
    case PRODUCTS.CUSTOM:
      return WORKFLOW_TYPES.CUSTOM_V1;
    default:
      logger.error(
        `Unable to find a workflow definition for ${partnerProduct.productId}`
      );
      return null;
  }
};
