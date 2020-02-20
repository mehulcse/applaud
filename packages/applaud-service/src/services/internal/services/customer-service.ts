import moment from "moment";
import * as yup from "yup";
import Customer from "../db/models/customer";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureUser, ensurePartnerAuthorization } from "../../auth/helpers";
import { CustomerCreatedJobHandler } from "../../jobs";
import { UnauthorizedAccessError } from "../../../errors";
import { AppContext } from "../../auth/app-context";
import { TaskService } from "./task-service";

export interface CustomersOptions extends PaginationArgs {
  search?: string;
  accountManagerUserId?: number | null;
  partnerId?: number;
  ids?: number[];
}

export interface CreateCustomerInput {
  partnerId: number;
  name: string;
  website?: string | null;
  accountManagerUserId?: number | null;
}

export interface UpdateCustomerInput {
  name?: string;
  website?: string;
  accountManagerUserId?: number | null;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class CustomerService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Customer> {
    const viewer = ensureUser(this.context.viewer);

    const query = Customer.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
      query.where({ partnerId: viewer.partnerUser.partnerId });
      if (!viewer.partnerUser.isAdmin) {
        query.where({ accountManagerUserId: viewer.userId });
      }
    } else if (viewer.vendorUsers.length > 0) {
      query.whereIn(
        "id",
        new TaskService(this.context)
          .getAllQuery({ vendorIds: viewer.vendorUsers.map(x => x.vendorId) })
          .select("customerId")
      );
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const customer = await query.findById(id);
    return customer || null;
  }

  getAllQuery(options: CustomersOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    if (options.partnerId) {
      query.where({ partnerId: options.partnerId });
    }

    if (options.ids && options.ids.length > 0) {
      query.whereIn("id", options.ids);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Customer.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Customer.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Customer.tableName}.id`, "asc");
        break;
    }

    return query.clone();
  }

  async getFirst(options: CustomersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: CustomersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: CustomersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateCustomerInput) {
    const schema = yup.object().shape({
      partnerId: yup
        .number()
        .label("Partner ID")
        .required()
        .nullable(false),
      name: yup
        .string()
        .label("Customer Name")
        .min(1)
        .max(255)
        .required()
        .nullable(false),
      website: yup
        .string()
        .label("Website")
        .notRequired()
        .nullable(true)
        .max(255)
        .default(""),
      accountManagerUserId: yup
        .number()
        .label("Account Manager User ID")
        .notRequired()
        .nullable(true)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateCustomerInput;

    // Authorize
    ensurePartnerAuthorization(
      this.context.viewer,
      validatedInput.partnerId,
      true
    );

    // Create the partner and insert into database
    const customer = await Customer.query().insertAndFetch({
      name: validatedInput.name,
      partnerId: validatedInput.partnerId,
      website: validatedInput.website || "",
      accountManagerUserId: validatedInput.accountManagerUserId,
      createdAt: moment.utc().toDate()
    });

    // Trigger Events
    await new CustomerCreatedJobHandler().enqueue({
      customerId: customer.id
    });

    return customer;
  }

  async update(customerId: number, updates: UpdateCustomerInput) {
    // Validate
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Customer Name")
        .min(1)
        .max(255)
        .notRequired()
        .nullable(false),
      website: yup
        .string()
        .label("Website")
        .notRequired()
        .nullable(true)
        .max(255)
        .default(""),
      accountManagerUserId: yup
        .number()
        .label("Account Manager User ID")
        .notRequired()
        .nullable(true)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateCustomerInput;

    const originalCustomer = await this.getById(customerId);
    if (!originalCustomer) {
      throw new Error("Invalid Customer ID specified.");
    }

    const viewer = ensureUser(this.context.viewer);
    if (
      viewer.partnerUsers.length > 0 &&
      viewer.partnerUser &&
      !viewer.partnerUser.isAdmin &&
      viewer.userId !== originalCustomer.accountManagerUserId
    ) {
      throw new UnauthorizedAccessError();
    }

    if (
      updates.accountManagerUserId &&
      updates.accountManagerUserId !== originalCustomer.accountManagerUserId
    ) {
      ensurePartnerAuthorization(
        this.context.viewer,
        originalCustomer.partnerId,
        true
      );
    }

    // Update
    const updatedCustomer = await Customer.query().patchAndFetchById(
      customerId,
      validatedUpdates
    );

    // Trigger Events
    // TODO: trigger customer updated event

    // Return
    return updatedCustomer;
  }
}
