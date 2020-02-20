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
import { ensureUser, ensureAdmin } from "../../auth/helpers";
import { ProductService } from "./product-service";
import PartnerAvailableProduct from "../db/models/partner-available-product";
import { getLogger } from "../../../logger";
import { PRODUCTS } from "../../../constants";
import { AppContext } from "../../auth/app-context";

export interface PartnerAvailableProductsOptions extends PaginationArgs {
  partnerId?: number;
  productId?: string;
}

export interface CreatePartnerAvailableProductInput {
  partnerId: number;
  productId: string;
  wholesalePrice: number;
}

export interface UpdatePartnerAvailableProductInput {
  wholesalePrice: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class PartnerAvailableProductService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<
    PartnerAvailableProduct
  > {
    const viewer = ensureUser(this.context.viewer);

    const query = PartnerAvailableProduct.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
      query.where({ partnerId: viewer.partnerUser.partnerId });
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const partnerAvailableProduct = await query.findById(id);
    return partnerAvailableProduct || null;
  }

  private getAllQuery(options: PartnerAvailableProductsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.partnerId) {
      query.where({ partnerId: options.partnerId });
    }

    if (options.productId) {
      query.where({ productId: options.productId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${PartnerAvailableProduct.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${PartnerAvailableProduct.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${PartnerAvailableProduct.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: PartnerAvailableProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: PartnerAvailableProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: PartnerAvailableProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreatePartnerAvailableProductInput) {
    ensureAdmin(this.context.viewer);

    const product = await new ProductService(this.context).getById(
      input.productId
    );

    // Validation
    const schema = yup.object().shape({
      partnerId: yup
        .number()
        .label("Partner ID")
        .required()
        .nullable(false),
      productId: yup
        .string()
        .label("Product ID")
        .required()
        .nullable(false)
        .test(
          "isProductIdValid",
          "Specified Product ID is not valid.",
          () => !!product
        ),
      wholesalePrice: yup
        .number()
        .label("Wholesale Price")
        .required()
        .nullable(false)
        .when("productId", {
          is: PRODUCTS.CUSTOM,
          then: yup.number().min(0),
          otherwise: yup.number().min(1)
        })
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreatePartnerAvailableProductInput;

    const existingPartnerAvailableProduct = await this.getFirst({
      partnerId: validatedInput.partnerId,
      productId: validatedInput.productId
    });

    if (existingPartnerAvailableProduct) {
      return existingPartnerAvailableProduct;
    }

    const partnerAvailableProduct = await PartnerAvailableProduct.query().insertAndFetch(
      {
        partnerId: validatedInput.partnerId,
        productId: validatedInput.productId,
        wholesalePrice: validatedInput.wholesalePrice,
        createdAt: moment.utc().toDate()
      }
    );

    return partnerAvailableProduct;
  }

  async update(
    partnerAvailableProductId: number,
    updates: UpdatePartnerAvailableProductInput
  ) {
    ensureAdmin(this.context.viewer);

    const partnerAvailableProduct = await this.getById(
      partnerAvailableProductId
    );
    if (!partnerAvailableProduct) {
      throw new Error("Invalid Partner Available Product ID specified.");
    }

    // Validation
    const schema = yup.object().shape({
      wholesalePrice: yup
        .number()
        .label("Wholesale Price")
        .required()
        .nullable(false)
        .min(1)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdatePartnerAvailableProductInput;

    const updatedPartnerAvailableProduct = await PartnerAvailableProduct.query().patchAndFetchById(
      partnerAvailableProductId,
      validatedUpdates
    );

    getLogger("update").debug("updatedPartnerAvailableProduct", {
      updatedPartnerAvailableProduct
    });

    return updatedPartnerAvailableProduct;
  }
}
