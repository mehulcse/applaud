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
  ensurePartnerAuthorization
} from "../../auth/helpers";
import Vendor from "../db/models/vendor";
import { AppContext } from "../../auth/app-context";
import { VendorCreatedJobHandler } from "../../jobs";

export interface VendorsOptions extends PaginationArgs {
  partnerId?: number | null;
  partnerIds?: number[];
  search?: string;
  ids?: number[];
}

export interface CreateVendorInput {
  partnerId?: number | null;
  name: string;
}

export interface UpdateVendorInput {}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class VendorService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Vendor> {
    const viewer = ensureUser(this.context.viewer);

    const query = Vendor.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
      query.where({ partnerId: viewer.partnerUser.partnerId });
    } else if (viewer.vendorUsers && viewer.vendorUsers.length > 0) {
      query.whereIn("id", viewer.vendorUsers.map(x => x.vendorId));
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const vendor = await query.findById(id);
    return vendor || null;
  }

  getAllQuery(options: VendorsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.partnerId !== undefined) {
      // Nulls are valid here
      query.where({ partnerId: options.partnerId });
    } else if (options.partnerIds && options.partnerIds.length > 0) {
      query.whereIn("partnerId", options.partnerIds);
    }

    if(options.ids && options.ids.length > 0) {
      query.whereIn("id", options.ids);
    }

    if (options.search) {
      query.where(`${Vendor.tableName}.name`, "like", `%${options.search}%`);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Vendor.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Vendor.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Vendor.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: VendorsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: VendorsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: VendorsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateVendorInput) {
    const viewer = ensureUser(this.context.viewer);

    if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
      if (!input.partnerId) {
        throw new Error("Partner ID is required.");
      }
      ensurePartnerAuthorization(this.context.viewer, input.partnerId, true);
    }

    // Validation
    const schema = yup.object().shape({
      partnerId: yup
        .number()
        .label("Partner ID")
        .notRequired()
        .nullable(true),
      name: yup
        .string()
        .label("Vendor Name")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateVendorInput;

    // Create the partner and insert into database
    const vendor = await Vendor.query().insertAndFetch({
      name: validatedInput.name,
      partnerId: validatedInput.partnerId,
      createdAt: moment.utc().toDate()
    });

    await new VendorCreatedJobHandler().enqueue({ vendorId: vendor.id });

    return vendor;
  }

  async update(vendorId: number, updates: UpdateVendorInput) {
    const vendor = await this.getById(vendorId);
    if (!vendor) {
      throw new Error("Invalid Vendor ID specified.");
    }
    if (vendor.partnerId) {
      ensurePartnerAuthorization(this.context.viewer, vendor.partnerId, true);
    } else {
      ensureAdmin(this.context.viewer);
    }

    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Vendor Name")
        .min(1)
        .max(255)
        .notRequired()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateVendorInput;

    const updatedVendor = await Vendor.query().patchAndFetchById(
      vendorId,
      validatedUpdates
    );
    return updatedVendor;
  }
}
