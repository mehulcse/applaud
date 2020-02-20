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
import { VendorService } from "./vendor-service";
import { ensureUser, ensureSuperAdmin } from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";
import VendorTaskTypeModel from "../db/models/vendor-task-type";
import { UnauthorizedAccessError } from "../../../errors";

export interface VendorTaskTypesOptions extends PaginationArgs {
  vendorId?: number;
  taskTypeIds?: string[];
}

export interface CreateVendorTaskTypeInput {
  vendorId: number;
  taskTypeId: string;
}

export class VendorTaskTypeService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<VendorTaskTypeModel> {
    const viewer = ensureUser(this.context.viewer);

    const query = VendorTaskTypeModel.query();
    let hasAccess = viewer.isAdmin;

    if (viewer.vendorUsers.length > 0) {
      hasAccess = true;
      query.whereIn("vendorId", viewer.vendorUsers.map(x => x.vendorId));
    }

    if (!hasAccess) {
      throw new UnauthorizedAccessError();
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const vendorTaskType = await query.findById(id);
    return vendorTaskType || null;
  }

  getAllQuery(options: VendorTaskTypesOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.vendorId) {
      query.where({ vendorId: options.vendorId });
    }

    if (options.taskTypeIds && options.taskTypeIds.length > 0) {
      query.whereIn("taskTypeId", options.taskTypeIds);
    }

    query.orderBy(`${VendorTaskTypeModel.tableName}.id`, "asc");

    return query;
  }

  async getFirst(options: VendorTaskTypesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: VendorTaskTypesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: VendorTaskTypesOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateVendorTaskTypeInput) {
    // Validation
    const schema = yup.object().shape({
      vendorId: yup
        .number()
        .label("Vendor ID")
        .required()
        .nullable(false),
      taskTypeId: yup
        .string()
        .label("Task Type ID")
        .required()
        .nullable(false)
        .max(255)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateVendorTaskTypeInput;

    const vendor = await new VendorService(this.context).getById(
      validatedInput.vendorId
    );

    if (!vendor) {
      throw new Error("Invalid Vendor ID specified.");
    }

    ensureSuperAdmin(this.context.viewer);

    let vendorTaskType = await this.getFirst({
      taskTypeIds: [validatedInput.taskTypeId],
      vendorId: validatedInput.vendorId
    });

    if (!vendorTaskType) {
      vendorTaskType = await VendorTaskTypeModel.query().insertAndFetch({
        vendorId: validatedInput.vendorId,
        taskTypeId: validatedInput.taskTypeId,
        createdAt: moment.utc().toDate()
      });
    }

    return vendorTaskType;
  }
}
