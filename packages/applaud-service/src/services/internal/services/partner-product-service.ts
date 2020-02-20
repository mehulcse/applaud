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
import { ensureUser, ensurePartnerAuthorization } from "../../auth/helpers";
import ChecklistDefinition from "../db/models/checklist-definition";
import PartnerProduct from "../db/models/partner-product";
import { ProductService } from "./product-service";
import { PRODUCTS } from "../../../constants";
import Vendor from "../db/models/vendor";
import { ChecklistDefinitionService } from "./checklist-definition-service";
import { VendorService } from "./vendor-service";
import { AppContext } from "../../auth/app-context";

export interface PartnerProductsOptions extends PaginationArgs {
  partnerId?: number;
  vendorId?: number;
  search?: string;
}

export interface CreatePartnerProductInput {
  partnerId: number;
  productId: string;
  name: string;
  activeAt?: Date | null;
  inactiveAt?: Date | null;
  vendorId?: number;
  checklistDefinitionId?: number;
}

export interface UpdatePartnerProductInput {
  name?: string;
  activeAt?: Date;
  inactiveAt?: Date;
  vendorId?: number;
  checklistDefinitionId?: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class PartnerProductService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<PartnerProduct> {
    const viewer = ensureUser(this.context.viewer);

    const query = PartnerProduct.query();
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
    const partnerProduct = await query.findById(id);
    return partnerProduct || null;
  }

  getAllQuery(options: PartnerProductsOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    if (options.partnerId) {
      query.where({ partnerId: options.partnerId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${PartnerProduct.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${PartnerProduct.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${PartnerProduct.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: PartnerProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: PartnerProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: PartnerProductsOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreatePartnerProductInput) {
    const viewer = ensurePartnerAuthorization(
      this.context.viewer,
      input.partnerId,
      true
    );

    const product = await new ProductService(this.context).getById(
      input.productId
    );

    let vendor: Vendor | null = null;
    if (input.vendorId) {
      vendor = await new VendorService(this.context).getById(input.vendorId);
    }

    let checklistDefinition: ChecklistDefinition | null = null;
    if (input.checklistDefinitionId) {
      checklistDefinition = await new ChecklistDefinitionService(
        this.context
      ).getById(input.checklistDefinitionId);
    }

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
      name: yup
        .string()
        .label("Name")
        .required()
        .nullable(false)
        .min(1)
        .max(255),
      activeAt: yup
        .date()
        .label("Active At")
        .notRequired()
        .default(() => moment.utc().toDate())
        .transform(date => {
          return moment
            .utc(date)
            .startOf("month")
            .toDate();
        })
        .nullable(false),
      inactiveAt: yup
        .date()
        .label("Inactive At")
        .notRequired()
        .transform(date => {
          return moment
            .utc(date)
            .endOf("month")
            .toDate();
        })
        .test("isValidInactiveAt", "Inactive At is not valid.", inactiveAt => {
          if (!inactiveAt) {
            return true;
          }
          if (
            input.activeAt &&
            moment.utc(inactiveAt).isSameOrBefore(moment.utc(input.activeAt))
          ) {
            return false;
          }
          return true;
        })
        .nullable(true),
      vendorId: yup.number().when("productId", {
        is: (x: string) => x === PRODUCTS.CUSTOM,
        then: yup
          .number()
          .label("Vendor ID")
          .required()
          .nullable(false)
          .test(
            "isVendorValid",
            "Vendor ID is not valid.",
            () => !!vendor && vendor.partnerId === input.partnerId
          ),
        otherwise: yup
          .number()
          .label("Vendor ID")
          .transform(_x => null)
          .notRequired()
      }),
      checklistDefinitionId: yup.number().when("productId", {
        is: (x: string) => x === PRODUCTS.CUSTOM,
        then: yup
          .number()
          .label("Checklist Definition ID")
          .required()
          .nullable(false)
          .test(
            "isChecklistDefinitionValid",
            "Checklist Definition ID is not valid.",
            () =>
              !!checklistDefinition &&
              checklistDefinition.partnerId === input.partnerId
          ),
        otherwise: yup
          .number()
          .label("Checklist Definition ID")
          .transform(_x => null)
          .notRequired()
      })
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreatePartnerProductInput;

    const partnerProduct = await PartnerProduct.query().insertAndFetch({
      name: validatedInput.name,
      partnerId: validatedInput.partnerId,
      productId: validatedInput.productId,
      createdAt: moment.utc().toDate(),
      activeAt: validatedInput.activeAt || moment.utc().toDate(),
      inactiveAt: validatedInput.inactiveAt || null,
      addedByUserId: viewer.userId,
      vendorId: validatedInput.vendorId,
      checklistDefinitionId: validatedInput.checklistDefinitionId
    });

    return partnerProduct;
  }

  async update(partnerProductId: number, updates: UpdatePartnerProductInput) {
    const partnerProduct = await this.getById(partnerProductId);
    if (!partnerProduct) {
      throw new Error("Partner Product ID is invalid.");
    }
    ensurePartnerAuthorization(
      this.context.viewer,
      partnerProduct.partnerId,
      true
    );

    let vendor: Vendor | null = null;
    if (updates.vendorId) {
      vendor = await new VendorService(this.context).getById(updates.vendorId);
    }

    let checklistDefinition: ChecklistDefinition | null = null;
    if (updates.checklistDefinitionId) {
      checklistDefinition = await new ChecklistDefinitionService(
        this.context
      ).getById(updates.checklistDefinitionId);
    }

    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Name")
        .min(1)
        .max(255)
        .notRequired()
        .nullable(false),
      activeAt: yup
        .date()
        .label("Active At")
        .notRequired()
        .nullable(false)
        .transform(date => {
          return moment
            .utc(date)
            .startOf("month")
            .toDate();
        })
        .test("isValidActiveAt", "Active At is not valid.", activeAt => {
          if (!activeAt) {
            return true;
          }
          if (!partnerProduct) {
            return false;
          }
          // Don't allow changes to active at if partner product is already active
          if (partnerProduct.activeAt < moment.utc().toDate()) {
            return false;
          }
          // Don't allow activeAt to be set to the past
          if (activeAt < moment.utc().toDate()) {
            return false;
          }
          return true;
        }),
      inactiveAt: yup
        .date()
        .label("Inactive At")
        .notRequired()
        .nullable(true)
        .transform(date => {
          return moment
            .utc(date)
            .endOf("month")
            .toDate();
        })
        .test("isValidInactiveAt", "Inactive At is not valid.", inactiveAt => {
          if (!inactiveAt) {
            return true;
          }
          if (!partnerProduct) {
            return false;
          }
          // Don't allow changes to active at if partner product is already active
          if (
            partnerProduct.inactiveAt &&
            partnerProduct.inactiveAt < moment.utc().toDate()
          ) {
            return false;
          }
          // Don't allow activeAt to be set to the past
          if (inactiveAt < moment.utc().toDate()) {
            return false;
          }
          if (
            updates.activeAt &&
            moment.utc(inactiveAt).isSameOrBefore(moment.utc(updates.activeAt))
          ) {
            return false;
          }
          return true;
        }),
      vendorId: yup.number().when("$partnerProduct", {
        is: () => partnerProduct.productId === PRODUCTS.CUSTOM,
        then: yup
          .number()
          .label("Vendor ID")
          .required()
          .nullable(false)
          .test("isVendorValid", "Vendor ID is not valid.", async vendorId => {
            if (!vendorId) {
              // Return true if value is null/undefined to prevent multiple errors for this field
              return true;
            }
            return !!vendor && vendor.partnerId === partnerProduct.partnerId;
          }),
        otherwise: yup
          .number()
          .label("Vendor ID")
          .transform(_x => null)
          .notRequired()
      }),
      checklistDefinitionId: yup.number().when("$partnerProduct", {
        is: () => partnerProduct.productId === PRODUCTS.CUSTOM,
        then: yup
          .number()
          .label("Checklist Definition ID")
          .required()
          .nullable(false)
          .test(
            "isChecklistDefinitionValid",
            "Checklist Definition ID is not valid.",
            async checklistDefinitionId => {
              if (!checklistDefinitionId) {
                // Return true if value is null/undefined to prevent multiple errors for this field
                return true;
              }
              return (
                !!checklistDefinition &&
                checklistDefinition.partnerId === partnerProduct.partnerId
              );
            }
          ),
        otherwise: yup
          .number()
          .label("Checklist Definition ID")
          .transform(_x => null)
          .notRequired()
      })
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdatePartnerProductInput;

    const updatedPartnerProduct = await PartnerProduct.query().patchAndFetchById(
      partnerProductId,
      validatedUpdates
    );

    return updatedPartnerProduct;
  }
}
