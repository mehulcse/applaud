import moment from "moment";
import * as yup from "yup";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import {
  ensureAdmin,
  ensureUser,
  getAllowedPartnerIds
} from "../../auth/helpers";
import Partner from "../db/models/partner";
import { AppContext } from "../../auth/app-context";

export interface PartnersOptions extends PaginationArgs {
  search?: string;
}

export interface CreatePartnerInput {
  name: string;
}

export interface UpdatePartnerInput {
  name?: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class PartnerService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Partner> {
    const viewer = ensureUser(this.context.viewer);

    const query = Partner.query();

    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUsers.length > 0) {
      query.whereIn("id", getAllowedPartnerIds(viewer));
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const partner = await query.findById(id);
    return partner || null;
  }

  private getAllQuery(options: PartnersOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Partner.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Partner.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Partner.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: PartnersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: PartnersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: PartnersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreatePartnerInput) {
    ensureAdmin(this.context.viewer);

    // Validation
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Partner Name")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreatePartnerInput;

    // Create the partner and insert into database
    const partner = await Partner.query().insertAndFetch({
      name: validatedInput.name,
      createdAt: moment.utc().toDate()
    });

    // TODO: trigger partner created event

    return partner;
  }

  async update(partnerId: number, updates: UpdatePartnerInput) {
    ensureAdmin(this.context.viewer);

    // const originalPartner = await this.getById(partnerId);

    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Name")
        .min(1)
        .max(255)
        .notRequired()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdatePartnerInput;

    const partner = await Partner.query().updateAndFetchById(
      partnerId,
      validatedUpdates
    );

    // TODO: trigger partner updated event

    return partner;
  }
}
