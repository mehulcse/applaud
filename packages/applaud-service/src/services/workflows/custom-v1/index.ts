import { getLogger } from "../../../logger";
import { COMMON_INTERNAL_STATUSES } from "../common-internal-statuses";
import { TASK_TYPES } from "../../../constants";
import { BaseWorkflowDefinition } from "../base-workflow-definition";
import { getSystemContext } from "../../auth/helpers";
import { PartnerProductService } from "../../internal/services/partner-product-service";
import { ChecklistDefinitionService } from "../../internal/services/checklist-definition-service";
import { ChecklistDefinitionItemService } from "../../internal/services/checklist-definition-item-service";
import { VendorService } from "../../internal/services/vendor-service";
import { TaskService } from "../../internal/services/task-service";
import Task, { TASK_STATUS } from "../../internal/db/models/task";
import Checklist from "../../internal/db/models/checklist";
import { ChecklistService } from "../../internal/services/checklist-service";
import { ChecklistItemService } from "../../internal/services/checklist-item-service";
import { OrderService } from "../../internal/services/order-service";

const logger = getLogger("custom-v1-workflow");

const STATES = {
  ...COMMON_INTERNAL_STATUSES,
  WAITING_FOR_CHECKLIST_COMPLETION: "waiting-for-checklist-completion"
};

export class CustomV1Workflow extends BaseWorkflowDefinition {
  execute = async () => {
    const workflow = await this.getWorkflow(true);
    if (!workflow) {
      logger.error(`Unable to find <workflow|${this.workflowId}>.`);
      return;
    }
    switch (workflow.internalStatus) {
      case STATES.INITIAL:
        return await this.handleInitial();
      case STATES.WAITING_FOR_CHECKLIST_COMPLETION:
        return await this.handleWaitingForChecklistCompletion();
      case STATES.COMPLETED:
        return await this.handleCompleted();
      default:
        logger.error(
          `Unrecognized internalStatus "${workflow.internalStatus}" for <workflow|${workflow.id}>`
        );
        return;
    }
  };

  async handleInitial() {
    const systemContext = await getSystemContext();
    const workflow = await this.getWorkflow();

    const order = await new OrderService(systemContext).getById(
      workflow.orderId
    );

    if (!order) {
      throw new Error(`Unable to find <order|${workflow.orderId}>.`);
    }

    const partnerProduct = await new PartnerProductService(
      systemContext
    ).getById(order.partnerProductId);
    if (!partnerProduct) {
      throw new Error(
        `Unable to find <partnerProduct|${order.partnerProductId}>`
      );
    }

    if (!partnerProduct.checklistDefinitionId) {
      throw new Error(
        `<partnerProduct|${partnerProduct.id}> (${partnerProduct.name}) does not have a Checklist Definition specified.`
      );
    }

    const checklistDefinition = await new ChecklistDefinitionService(
      systemContext
    ).getById(partnerProduct.checklistDefinitionId);

    if (!checklistDefinition) {
      throw new Error(
        `Unable to find <checklistDefinition|${partnerProduct.checklistDefinitionId}>`
      );
    }

    if (!partnerProduct.vendorId) {
      throw new Error(
        `<partnerProduct|${partnerProduct.id}> (${partnerProduct.name}) does not have a Vendor specified.`
      );
    }
    const vendor = await new VendorService(systemContext).getById(
      partnerProduct.vendorId
    );

    if (!vendor) {
      throw new Error(
        `Unable to find <vendor|${partnerProduct.checklistDefinitionId}>`
      );
    }

    let task: Task | null;
    task = await new TaskService(systemContext).getFirst({
      taskTypeIds: [TASK_TYPES.CHECKLIST],
      workflowIds: [workflow.id]
    });

    if (!task) {
      task = await new TaskService(systemContext).create({
        workflowId: this.workflowId,
        taskTypeId: TASK_TYPES.CHECKLIST,
        availableAt: new Date(),
        assignedUserId: null,
        vendorId: vendor.id
      });
    }

    let checklist: Checklist | null;
    checklist = await new ChecklistService(systemContext).getFirst({
      taskId: task.id
    });

    if (!checklist) {
      checklist = await new ChecklistService(systemContext).create({
        checklistDefinitionId: partnerProduct.checklistDefinitionId,
        taskId: task.id
      });
    }

    const checklistItems = await new ChecklistItemService(systemContext).getAll(
      {
        checklistId: checklist.id
      }
    );
    if (checklistItems.length === 0) {
      const checklistDefinitionItems = await new ChecklistDefinitionItemService(
        systemContext
      ).getAll({
        checklistDefinitionId: partnerProduct.checklistDefinitionId
      });

      if (checklistDefinitionItems.length > 0) {
        await Promise.all(
          checklistDefinitionItems.map(async item => {
            await new ChecklistItemService(systemContext).create({
              checklistId: (checklist as Checklist).id,
              name: item.name,
              order: item.order
            });
          })
        );
      }
    }

    await this.ensureWorkflowInternalStatus(
      STATES.WAITING_FOR_CHECKLIST_COMPLETION
    );
    await this.execute();
  }

  async handleWaitingForChecklistCompletion() {
    const systemContext = await getSystemContext();
    const checklistTask = await new TaskService(systemContext).getFirst({
      workflowIds: [this.workflowId],
      taskTypeIds: [TASK_TYPES.CHECKLIST]
    });
    if (!checklistTask) {
      throw new Error(
        `Unable to find Checklist Task for <workflow|${this.workflowId}>`
      );
    }
    if (checklistTask.status !== TASK_STATUS.COMPLETED.id) {
      return;
    }

    await this.ensureWorkflowInternalStatus(STATES.COMPLETED);
    await this.execute();
  }

  async handleCompleted() {
    await this.completeWorkflow();
  }
}
