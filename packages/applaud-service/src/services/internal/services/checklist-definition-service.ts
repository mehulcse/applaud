import * as yup from "yup";
import { transaction } from "objection";
import moment from "moment";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import { QueryBuilder } from "objection";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import ChecklistDefinition from "../db/models/checklist-definition";
import ChecklistDefinitionItem from "../db/models/checklist-definition-items";
import {
  ensureUser,
  getAllowedPartnerIds,
  ensurePartnerAuthorization
} from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";

export interface ChecklistDefinitionsOptions extends PaginationArgs {
  search?: string;
  partnerId?: number;
}

export interface CreateChecklistDefinitionInput {
  partnerId: number;
  name: string;
  items: {
    name: string;
    order: number;
  }[];
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class ChecklistDefinitionService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<ChecklistDefinition> {
    const viewer = ensureUser(this.context.viewer);

    const query = ChecklistDefinition.query();
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
    const checklistDefinition = await query.findById(id);
    return checklistDefinition || null;
  }

  private getAllQuery(
    options: ChecklistDefinitionsOptions
  ): QueryBuilder<
    ChecklistDefinition,
    ChecklistDefinition[],
    ChecklistDefinition[]
  > {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.partnerId) {
      query.where({ partnerId: options.partnerId });
    }

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${ChecklistDefinition.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${ChecklistDefinition.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${ChecklistDefinition.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: ChecklistDefinitionsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: ChecklistDefinitionsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: ChecklistDefinitionsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateChecklistDefinitionInput) {
    // Validation
    const schema = yup.object().shape({
      partnerId: yup
        .number()
        .label("Partner ID")
        .required()
        .nullable(false),
      name: yup
        .string()
        .label("Name")
        .required()
        .nullable(false),
      items: yup
        .array(
          yup.object().shape({
            name: yup
              .string()
              .label("Name")
              .required()
              .nullable(false),

            order: yup
              .number()
              .label("Order")
              .required()
              .nullable(false)
          })
        )
        .min(1)
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateChecklistDefinitionInput;

    ensurePartnerAuthorization(
      this.context.viewer,
      validatedInput.partnerId,
      true
    );

    const checklistDefinition = await transaction(
      ChecklistDefinition.knex(),
      async trx => {
        // first create the checklist definition
        const checklistDef = await ChecklistDefinition.query(
          trx
        ).insertAndFetch({
          partnerId: validatedInput.partnerId,
          name: validatedInput.name,
          createdAt: moment.utc().toDate()
        });

        await ChecklistDefinitionItem.query(trx).insertGraph(
          validatedInput.items.map(item => ({
            checklistDefinitionId: checklistDef.id,
            name: item.name,
            createdAt: moment.utc().toDate(),
            order: item.order,
            partnerId: validatedInput.partnerId
          }))
        );

        return checklistDef;
      }
    );

    return checklistDefinition;
  }
}
