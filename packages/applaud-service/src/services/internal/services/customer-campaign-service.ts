import moment from "moment";
import * as yup from "yup";
import { QueryInitializationResult, DateQuery } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll,
  generateDateQuery
} from "../helpers";
import { CustomerService } from "./customer-service";
import { ensureUser } from "../../auth/helpers";
import {
  CustomerCampaignModel,
  CustomerCampaign
} from "../db/models/customer-campaign";
import { AppContext } from "../../auth/app-context";

export interface CustomerCampaignsOptions extends PaginationArgs {
  customerId?: number;
  startsAt?: DateQuery;
  endsAt?: DateQuery;
}

export interface CreateCustomerCampaignInput {
  name: string;
  customerId: number;
  startsAt: Date;
  endsAt: Date;
  amount: number;
}

export interface UpdateCustomerCampaignInput {
  name?: string;
  startsAt?: Date;
  endsAt?: Date;
  amount?: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class CustomerCampaignService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<
    CustomerCampaignModel
  > {
    const viewer = ensureUser(this.context.viewer);

    const query = CustomerCampaignModel.query();

    // Filter out "deleted" Customer Campaigns
    query.whereNull("deletedAt");

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

  async getById(id: number): Promise<CustomerCampaign | null> {
    const { query } = this.initializeAuthorizedQuery();
    const customerCampaign = await query.findById(id);
    return customerCampaign || null;
  }

  private getAllQuery(options: CustomerCampaignsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.customerId) {
      query.where({ customerId: options.customerId });
    }

    if (options.startsAt) {
      generateDateQuery(query, "startsAt", options.startsAt);
    }

    if (options.endsAt) {
      generateDateQuery(query, "endsAt", options.endsAt);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${CustomerCampaignModel.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${CustomerCampaignModel.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${CustomerCampaignModel.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(
    options: CustomerCampaignsOptions
  ): Promise<CustomerCampaign | null> {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: CustomerCampaignsOptions): Promise<number> {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: CustomerCampaignsOptions): Promise<CustomerCampaign[]> {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateCustomerCampaignInput): Promise<CustomerCampaign> {
    // Validation
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Name")
        .required()
        .nullable(false)
        .max(255),
      customerId: yup
        .number()
        .label("Customer ID")
        .required()
        .nullable(false),
      startsAt: yup
        .date()
        .label("Start Date")
        .required()
        .nullable(false)
        .transform(date => {
          return moment
            .utc(date)
            .startOf("month")
            .toDate();
        })
        .min(
          moment
            .utc()
            .startOf("month")
            .toDate(),
          "Start Date cannot be earlier than this month."
        )
        .max(
          moment()
            .utc()
            .add(6, "months")
            .startOf("month")
            .toDate(),
          "Campaigns can only be scheduled to start within the next 6 months."
        ),
      endsAt: yup
        .date()
        .label("End Date")
        .required()
        .nullable(false)
        .transform(date => {
          return moment
            .utc(date)
            .endOf("month")
            .toDate();
        })
        .min(
          moment
            .utc()
            .endOf("month")
            .toDate(),
          "End Date cannot be earlier than the end of this month."
        )
        .max(
          moment
            .utc()
            .add(12, "months")
            .endOf("month")
            .toDate(),
          "Campaigns can only be scheduled for the next 12 months."
        ),
      amount: yup
        .number()
        .label("Amount")
        .required()
        .min(1)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateCustomerCampaignInput;

    const viewer = ensureUser(this.context.viewer);

    // Getting customer will enforce authorization
    await new CustomerService(this.context).getById(validatedInput.customerId);

    const overlappedCustomerCampaign = await this.getFirst({
      customerId: validatedInput.customerId,
      endsAt: { gte: validatedInput.startsAt }
    });

    if (overlappedCustomerCampaign) {
      throw new Error("Only one campaign can be active at a given time.");
    }

    // Create the partner and insert into database
    const customerCampaign = await CustomerCampaignModel.query().insertAndFetch(
      {
        name: validatedInput.name,
        customerId: validatedInput.customerId,
        startsAt: validatedInput.startsAt,
        endsAt: validatedInput.endsAt,
        amount: validatedInput.amount,
        addedByUserId: viewer.userId,
        createdAt: moment.utc().toDate()
      }
    );

    return customerCampaign;
  }

  async update(
    customerCampaignId: number,
    updates: UpdateCustomerCampaignInput
  ): Promise<CustomerCampaign> {
    // Validation
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Name")
        .notRequired()
        .nullable(false)
        .max(255),
      startsAt: yup
        .date()
        .label("Start Date")
        .notRequired()
        .nullable(false)
        .transform(date => {
          return moment
            .utc(date)
            .startOf("month")
            .toDate();
        })
        .min(
          moment()
            .utc()
            .startOf("month")
            .add(-1, "day")
            .toDate(),
          "Start Date cannot be earlier than this month."
        )
        .max(
          moment()
            .utc()
            .add(6, "months")
            .startOf("month")
            .toDate(),
          "Campaigns can only be scheduled to start within the next 6 months."
        ),
      endsAt: yup
        .date()
        .label("End Date")
        .notRequired()
        .nullable(false)
        .transform(date => {
          return moment
            .utc(date)
            .endOf("month")
            .toDate();
        })
        .min(
          moment()
            .utc()
            .endOf("month")
            .toDate(),
          "End Date cannot be earlier than the end of this month."
        )
        .max(
          moment()
            .utc()
            .add(12, "months")
            .startOf("month")
            .toDate(),
          "Campaigns can only be scheduled for the 12 months."
        ),
      amount: yup
        .number()
        .label("Amount")
        .notRequired()
        .min(1)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateCustomerCampaignInput;

    const originalCustomerCampaign = await this.getById(customerCampaignId);
    if (!originalCustomerCampaign) {
      throw new Error("Invalid Customer Campaign ID specified.");
    }

    if (originalCustomerCampaign.startsAt <= moment.utc().toDate()) {
      // The campaign is already active. Only allow changes to endsAt and name
      if (
        updates.startsAt &&
        updates.startsAt !== originalCustomerCampaign.startsAt
      ) {
        throw new Error(
          "Start Date cannot be modified after campaign is already active."
        );
      }
      if (
        updates.amount &&
        updates.amount !== originalCustomerCampaign.amount
      ) {
        throw new Error(
          "Amount cannot be modified after campaign is already active."
        );
      }
    } else {
      const startsAt = validatedUpdates.startsAt
        ? validatedUpdates.startsAt
        : originalCustomerCampaign.startsAt;
      const overlappedCustomerCampaign = await this.getFirst({
        customerId: originalCustomerCampaign.customerId,
        endsAt: { gte: startsAt }
      });

      if (
        overlappedCustomerCampaign &&
        overlappedCustomerCampaign.id !== customerCampaignId
      ) {
        throw new Error(
          `Only one campaign can be active at a given time. (Would overlap "${overlappedCustomerCampaign.name}")`
        );
      }
    }

    const updatedCustomerCampaign = await CustomerCampaignModel.query().patchAndFetchById(
      customerCampaignId,
      validatedUpdates
    );
    return updatedCustomerCampaign;
  }

  async delete(customerCampaignId: number) {
    const customerCampaign = await this.getById(customerCampaignId);

    if (!customerCampaign) {
      throw new Error("Invalid Customer Campaign ID specified.");
    }
    if (customerCampaign.startsAt <= moment.utc().toDate()) {
      throw new Error("Only scheduled campaigns can be deleted.");
    }
    await CustomerCampaignModel.query().patchAndFetchById(customerCampaignId, {
      deletedAt: moment.utc().toDate()
    });
  }
}
