import * as yup from "yup";
import moment from "moment";
import { QueryInitializationResult, DateQuery } from "../common";
import { PaginationArgs } from "../common";
import { ensureUser } from "../../auth/helpers";
import PartnerProductPriceModel from "../db/models/partner-product-price";
import { PartnerProductService } from "./partner-product-service";
import {
  executeSelectAll,
  executeSelectCount,
  executeSelectFirst,
  generateDateQuery,
  handlePagination
} from "../helpers";
import { AppContext } from "../../auth/app-context";

export type PartnerProductPriceSort =
  | "ID_ASC"
  | "ID_DESC"
  | "STARTS_AT_ASC"
  | "STARTS_AT_DESC";

export interface PartnerProductPriceOptions
  extends PaginationArgs<PartnerProductPriceSort> {
  partnerProductId?: number;
  startsAt?: DateQuery;
}

export interface CreatePartnerProductPriceInput {
  partnerProductId: number;
  startsAt: Date;
  price: number;
}

export interface UpdatePartnerProductPriceInput {
  startsAt?: Date;
  price?: number;
}

export class PartnerProductPriceService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<
    PartnerProductPriceModel
  > {
    const viewer = ensureUser(this.context.viewer);
    const query = PartnerProductPriceModel.query();

    query.whereNull("deletedAt");

    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUser) {
      query.whereIn(
        "partnerProductId",
        new PartnerProductService(this.context)
          .getAllQuery({ partnerId: viewer.partnerUser.partnerId })
          .select("id")
      );
    } else {
      throw new Error("Unauthorized access.");
    }
    return {
      query
    };
  }

  async getById(id: number): Promise<PartnerProductPriceModel | null> {
    const { query } = this.initializeAuthorizedQuery();
    const partnerProductPrice = await query.findById(id);
    return partnerProductPrice || null;
  }

  private getAllQuery(options: PartnerProductPriceOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.partnerProductId) {
      query.where({ partnerProductId: options.partnerProductId });
    }

    if (options.startsAt) {
      generateDateQuery(query, "startsAt", options.startsAt);
    }

    switch (options.sort) {
      case "ID_ASC":
        query.orderBy(`${PartnerProductPriceModel.tableName}.id`, "asc");
        break;
      case "ID_DESC":
        query.orderBy(`${PartnerProductPriceModel.tableName}.id`, "desc");
        break;
      case "STARTS_AT_ASC":
        query.orderBy(`${PartnerProductPriceModel.tableName}.startsAt`, "asc");
        break;
      case "STARTS_AT_DESC":
        query.orderBy(`${PartnerProductPriceModel.tableName}.startsAt`, "desc");
        break;
      default:
        query.orderBy(`${PartnerProductPriceModel.tableName}.startsAt`, "desc");
        break;
    }

    return query;
  }

  async getFirst(options: PartnerProductPriceOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: PartnerProductPriceOptions): Promise<number> {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(
    options: PartnerProductPriceOptions
  ): Promise<PartnerProductPriceModel[]> {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(
    input: CreatePartnerProductPriceInput
  ): Promise<PartnerProductPriceModel> {
    // Validation
    const schema = yup.object().shape({
      partnerProductId: yup
        .number()
        .label("Partner Product ID")
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
            .subtract(1, "hour")
            .toDate(),
          "Start Date cannot be earlier than today."
        ),
      price: yup
        .number()
        .label("Price")
        .required()
        .min(1)
    });

    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreatePartnerProductPriceInput;

    const viewer = ensureUser(this.context.viewer);

    // Getting partner product will enforce authorization
    await new PartnerProductService(this.context).getById(
      validatedInput.partnerProductId
    );

    const overlappedPrice = await this.getFirst({
      partnerProductId: validatedInput.partnerProductId,
      startsAt: { eq: validatedInput.startsAt }
    });

    if (overlappedPrice) {
      throw new Error("Only one price can be effective for a given month.");
    }

    // Create the partner and insert into database
    const partnerProductPrice = await PartnerProductPriceModel.query().insertAndFetch(
      {
        partnerProductId: validatedInput.partnerProductId,
        startsAt: validatedInput.startsAt,
        price: validatedInput.price,
        addedByUserId: viewer.userId,
        createdAt: moment.utc().toDate()
      }
    );

    return partnerProductPrice;
  }

  async update(
    partnerProductPriceId: number,
    updates: UpdatePartnerProductPriceInput
  ): Promise<PartnerProductPriceModel> {
    // Validation
    const schema = yup.object().shape({
      startsAt: yup
        .date()
        .label("Start Date")
        .notRequired()
        .nullable(false)
        .min(
          moment.utc().toDate(),
          "Start Date cannot be earlier than this month."
        )
        .transform(date => {
          return moment
            .utc(date)
            .startOf("month")
            .toDate();
        }),
      price: yup
        .number()
        .label("Price")
        .notRequired()
        .min(1)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdatePartnerProductPriceInput;

    // TODO: ensure partner authorization (admin required)

    const originalPartnerProductPrice = await this.getById(
      partnerProductPriceId
    );
    if (!originalPartnerProductPrice) {
      throw new Error("Invalid Partner Product Price ID specified.");
    }

    const startsAt = validatedUpdates.startsAt
      ? validatedUpdates.startsAt
      : originalPartnerProductPrice.startsAt;

    if (originalPartnerProductPrice.startsAt <= moment.utc().toDate()) {
      throw new Error("Changes cannot be made to an already effective price.");
    } else if (
      !moment.utc(originalPartnerProductPrice.startsAt).isSame(startsAt)
    ) {
      const overlappedPrice = await this.getFirst({
        partnerProductId: originalPartnerProductPrice.partnerProductId,
        startsAt: { eq: startsAt }
      });

      if (!!overlappedPrice) {
        throw new Error("Only one price can be effective for a given month.");
      }
    }

    const updatePartnerProductPrice = await PartnerProductPriceModel.query().patchAndFetchById(
      partnerProductPriceId,
      validatedUpdates
    );
    return updatePartnerProductPrice;
  }

  async delete(partnerProductPriceId: number): Promise<void> {
    const partnerProductPrice = await this.getById(partnerProductPriceId);

    if (!partnerProductPrice) {
      throw new Error("Invalid Partner Product Price ID specified.");
    }

    if (partnerProductPrice.startsAt < new Date()) {
      throw new Error("Invalid Partner Product Price ID specified.");
    }

    await PartnerProductPriceModel.query().patchAndFetchById(
      partnerProductPriceId,
      { deletedAt: new Date() }
    );
  }
}
