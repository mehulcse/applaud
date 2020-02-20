import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import ChecklistDefinitionItem from "../db/models/checklist-definition-items";
import { ensureUser, getAllowedPartnerIds } from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";

export interface ChecklistDefinitionItemsOptions extends PaginationArgs {
  partnerId?: number;
  checklistDefinitionId?: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class ChecklistDefinitionItemService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<
    ChecklistDefinitionItem
  > {
    const viewer = ensureUser(this.context.viewer);

    const query = ChecklistDefinitionItem.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUsers.length > 0) {
      query.whereIn("partnerId", getAllowedPartnerIds(viewer));
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const checklistDefinitionItem = await query.findById(id);
    return checklistDefinitionItem || null;
  }

  private getAllQuery(options: ChecklistDefinitionItemsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.checklistDefinitionId) {
      query.where({ checklistDefinitionId: options.checklistDefinitionId });
    }

    if (options.partnerId) {
      query.where({ partnerId: options.partnerId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${ChecklistDefinitionItem.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${ChecklistDefinitionItem.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${ChecklistDefinitionItem.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: ChecklistDefinitionItemsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: ChecklistDefinitionItemsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: ChecklistDefinitionItemsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  // For creation, see ChecklistDefinitionService.create
}
