import moment from "moment";
import * as yup from "yup";
import Order, { ORDER_STATUS } from "../db/models/order";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import { QueryBuilder, transaction } from "objection";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { CustomerService } from "./customer-service";
import { CustomerKeywordService } from "./customer-keyword-service";
import { ensureUser } from "../../auth/helpers";
import { UnauthorizedAccessError } from "../../../errors";
import { OrderCreatedJobHandler } from "../../jobs";
import CustomerKeyword from "../db/models/customer-keyword";
import { AppContext } from "../../auth/app-context";
import { OrderUpdatedJobHandler } from "../../jobs/handlers/order-updated";

export interface OrdersOptions extends PaginationArgs {
  search?: string;
  customerIds?: number[];
  partnerId?: number;
  statusIds?: string[];
}

export interface CreateOrderInput {
  customerId: number;
  partnerProductId: number;
  startDate?: Date | null;
  keyword?: string;
}

export interface UpdateOrderInput {
  startDate?: Date;
  status?: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC",
  CREATED_AT_ASC: "CREATED_AT_ASC",
  CREATED_AT_DESC: "CREATED_AT_DESC"
};

export class OrderService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Order> {
    const viewer = ensureUser(this.context.viewer);

    const query = Order.query();
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
    const order = await query.findById(id);
    return order || null;
  }

  private getAllQuery(
    options: OrdersOptions
  ): QueryBuilder<Order, Order[], Order[]> {
    const { query } = this.initializeAuthorizedQuery();

    query.where({ isDeleted: false });

    handlePagination(query, options);

    if (options.customerIds && options.customerIds.length > 0) {
      query.whereIn(
        "customerId",
        new CustomerService(this.context)
          .getAllQuery({ ids: options.customerIds })
          .select("id")
      );
    }

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    if (options.statusIds && options.statusIds.length > 0) {
      query.whereIn("status", options.statusIds);
    }

    if (options.partnerId) {
      query.whereIn(
        "customerId",
        new CustomerService(this.context)
          .getAllQuery({ partnerId: options.partnerId })
          .select("id")
      );
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Order.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Order.tableName}.id`, "desc");
        break;
      case SORTS.CREATED_AT_ASC:
        query.orderBy(`${Order.tableName}.createdAt`, "asc");
        break;
      case SORTS.CREATED_AT_DESC:
        query.orderBy(`${Order.tableName}.createdAt`, "desc");
        break;
      default:
        query.orderBy(`${Order.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: OrdersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: OrdersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: OrdersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateOrderInput) {
    // Validation
    const schema = yup.object().shape({
      customerId: yup
        .number()
        .label("Customer ID")
        .required()
        .nullable(false),
      partnerProductId: yup
        .number()
        .label("Partner Product ID")
        .required()
        .nullable(false),
      startDate: yup
        .date()
        .label("Start Date")
        .notRequired()
        .nullable(true)
        .default(moment.utc().toDate())
        .transform(value => (!!value ? value : moment.utc().toDate())),
      keyword: yup
        .string()
        .label("Keyword")
        .notRequired()
        .nullable(false)
        .max(255)
        .trim()
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateOrderInput;

    const viewer = ensureUser(this.context.viewer);

    const customer = await new CustomerService(this.context).getById(
      validatedInput.customerId
    );

    if (!customer) {
      throw new UnauthorizedAccessError();
    }
    let customerKeyword: CustomerKeyword | null;
    if (validatedInput.keyword) {
      customerKeyword = await new CustomerKeywordService(this.context).getFirst(
        { name: validatedInput.keyword, includeInactive: true }
      );
    }

    const order = await transaction(Order.knex(), async trx => {
      if (!customerKeyword && validatedInput.keyword) {
        customerKeyword = await new CustomerKeywordService(this.context).create(
          {
            name: validatedInput.keyword,
            customerId: validatedInput.customerId
          },
          trx
        );
      }
      const order = await Order.query(trx).insertAndFetch({
        customerId: validatedInput.customerId,
        partnerProductId: validatedInput.partnerProductId,
        userId: viewer.userId,
        startDate: validatedInput.startDate || moment.utc().toDate(),
        customerKeywordId:
          customerKeyword && customerKeyword.id ? customerKeyword.id : undefined
      });

      return order;
    });

    await new OrderCreatedJobHandler().enqueue({
      orderId: order.id
    });

    return order;
  }

  async update(orderId: number, updates: UpdateOrderInput) {
    const order = await this.getById(orderId);
    if (!order) {
      throw new Error("Invalid Order ID specified.");
    }

    const schema = yup.object().shape({
      startDate: yup
        .date()
        .label("Start Date")
        .notRequired()
        .nullable(false),
      status: yup
        .string()
        .label("Status")
        .notRequired()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateOrderInput;

    const updatedOrder = await Order.query().patchAndFetchById(
      orderId,
      validatedUpdates
    );

    await new OrderUpdatedJobHandler().enqueue({
      original: order,
      updated: updatedOrder
    });

    return updatedOrder;
  }

  async delete(orderId: number) {
    const order = await this.getById(orderId);
    if (!order) {
      throw new Error("Invalid Order ID specified.");
    }

    const customer = await new CustomerService(this.context).getById(
      order.customerId
    );
    if (!customer) {
      throw new Error("Invalid Order ID specified.");
    }

    if (order.status !== ORDER_STATUS.NEW.id) {
      throw new Error("Specified order cannot be deleted.");
    }

    await Order.query()
      .patch({ isDeleted: true, deletedAt: moment.utc().toDate() })
      .where({ id: order.id });
  }
}
