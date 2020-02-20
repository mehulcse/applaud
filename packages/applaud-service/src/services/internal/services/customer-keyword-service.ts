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
import { ensureUser } from "../../auth/helpers";
import CustomerKeyword from "../db/models/customer-keyword";
import { CustomerService } from "./customer-service";
import Objection from "objection";
import { AppContext } from "../../auth/app-context";

export interface CustomerKeywordsOptions extends PaginationArgs {
  customerId?: number;
  search?: string;
  includeInactive?: boolean;
  name?: string;
}

export interface CreateCustomerKeywordInput {
  customerId: number;
  name: string;
}

export interface UpdateCustomerKeywordInput {
  isActive: boolean;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class CustomerKeywordService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<CustomerKeyword> {
    const viewer = ensureUser(this.context.viewer);

    const query = CustomerKeyword.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
      if (viewer.partnerUser.isAdmin) {
        query.whereIn(
          "customerId",
          new CustomerService(this.context).getAllQuery({}).select("id")
        );
      } else {
        query.whereIn(
          "customerId",
          new CustomerService(this.context)
            .getAllQuery({
              accountManagerUserId: viewer.userId
            })
            .select("id")
        );
      }
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const customerKeyword = await query.findById(id);
    return customerKeyword || null;
  }

  getAllQuery(options: CustomerKeywordsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.customerId) {
      query.where({ customerId: options.customerId });
    }

    if (options.name) {
      query.where({ name: options.name });
    }

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    if (!options.includeInactive) {
      query.where("isActive", true);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${CustomerKeyword.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${CustomerKeyword.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${CustomerKeyword.tableName}.id`, "asc");
        break;
    }

    return query.clone();
  }

  async getFirst(options: CustomerKeywordsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: CustomerKeywordsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: CustomerKeywordsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateCustomerKeywordInput, trx?: Objection.Transaction) {
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Name")
        .min(1)
        .required()
        .nullable(false),
      customerId: yup
        .number()
        .label("Customer ID")
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateCustomerKeywordInput;

    const viewer = ensureUser(this.context.viewer);

    // Getting customer will enforce authorization
    await new CustomerService(this.context).getById(input.customerId);

    const customerKeyword = await CustomerKeyword.query(trx).insertAndFetch({
      customerId: validatedInput.customerId,
      name: validatedInput.name,
      createdAt: moment.utc().toDate(),
      addedByUserId: viewer.userId,
      isActive: true
    });

    // Trigger Events
    // TODO: trigger customer keyword updated event

    return customerKeyword;
  }

  async update(customerKeywordId: number, updates: UpdateCustomerKeywordInput) {
    // Validate
    const schema = yup.object().shape({
      isActive: yup
        .boolean()
        .label("Is Active")
        .required()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateCustomerKeywordInput;

    const originalCustomerKeyword = await this.getById(customerKeywordId);

    if (!originalCustomerKeyword) {
      throw new Error("Invalid Customer Keyword ID specified.");
    }

    // Update
    const updatedCustomerKeyword = await CustomerKeyword.query().patchAndFetchById(
      customerKeywordId,
      validatedUpdates
    );

    // Trigger Events
    // TODO: trigger customer keyword updated event

    return updatedCustomerKeyword;
  }
}
