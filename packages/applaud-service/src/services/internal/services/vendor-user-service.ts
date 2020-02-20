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
import { UserService } from "./user-service";
import { UserRoleService } from "./user-role-service";
import { ROLES } from "../../../constants";
import VendorUser from "../db/models/vendor-user";
import { VendorService } from "./vendor-service";
import {
  ensureUser,
  getAllowedPartnerIds,
  ensurePartnerAuthorization,
  ensureAdmin
} from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";

export interface VendorUsersOptions extends PaginationArgs {
  vendorId?: number;
  vendorIds?: number[];
  userId?: number;
  includeInactive?: boolean;
}

export interface CreateVendorUserInput {
  vendorId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UpdateVendorUserInput {
  isActive: boolean;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class VendorUserService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<VendorUser> {
    const viewer = ensureUser(this.context.viewer);

    const query = VendorUser.query();
    if (viewer.isAdmin) {
      // No restrictions
    } else if (viewer.partnerUsers.length > 0 && viewer.partnerUser) {
      query.whereIn(
        "vendorId",
        new VendorService(this.context)
          .getAllQuery({ partnerIds: getAllowedPartnerIds(viewer) })
          .select("id")
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
    const vendorUser = await query.findById(id);
    return vendorUser || null;
  }

  getAllQuery(options: VendorUsersOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.vendorId) {
      query.where({ vendorId: options.vendorId });
    }

    if (options.userId) {
      query.where({ userId: options.userId });
    }

    if (!options.includeInactive) {
      query.where({ isActive: !options.includeInactive });
    }

    if (options.vendorIds) {
      query.whereIn("vendorId", options.vendorIds);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${VendorUser.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${VendorUser.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${VendorUser.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: VendorUsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: VendorUsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: VendorUsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateVendorUserInput) {
    // Validation
    const schema = yup.object().shape({
      vendorId: yup
        .number()
        .label("Vendor ID")
        .required()
        .nullable(false),
      firstName: yup
        .string()
        .label("First Name")
        .required()
        .nullable(false)
        .max(255),
      lastName: yup
        .string()
        .label("Last Name")
        .required()
        .nullable(false)
        .max(255),
      email: yup
        .string()
        .label("Email")
        .email()
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateVendorUserInput;

    const vendor = await new VendorService(this.context).getById(
      validatedInput.vendorId
    );

    if (!vendor) {
      throw new Error("Invalid Vendor ID specified.");
    }

    const viewer = ensureUser(this.context.viewer);

    if (vendor.partnerId) {
      ensurePartnerAuthorization(this.context.viewer, vendor.partnerId, true);
    } else {
      ensureAdmin(this.context.viewer);
    }

    let user = await new UserService(this.context).getByEmail(
      validatedInput.email
    );

    if (!!user) {
      const userRoleCount = await new UserRoleService(this.context).getCount({
        userId: user.id,
        roleIds: [ROLES.ADMIN, ROLES.SUPER_ADMIN]
      });
      if (userRoleCount > 0) {
        throw new Error("Unable to add specified user as a Vendor User.");
      }
    } else {
      user = await new UserService(this.context).create({
        firstName: validatedInput.firstName,
        lastName: validatedInput.lastName,
        email: validatedInput.email
      });
    }
    if (!user) {
      throw new Error("Unable to locate or create specified user.");
    }

    let vendorUser = await this.getFirst({
      vendorId: vendor.id,
      userId: user.id
    });

    if (vendorUser) {
      return vendorUser;
    }

    vendorUser = await VendorUser.query().insertAndFetch({
      userId: user.id,
      vendorId: vendor.id,
      addedByUserId: viewer.userId,
      createdAt: moment.utc().toDate()
    });

    return vendorUser;
  }

  async update(vendorUserId: number, updates: UpdateVendorUserInput) {
    const originalVendorUser = await this.getById(vendorUserId);
    if (!originalVendorUser) {
      throw new Error("Invalid Vendor User ID specified.");
    }

    const vendor = await new VendorService(this.context).getById(
      originalVendorUser.vendorId
    );
    if (!vendor) {
      throw new Error("Invalid Vendor User ID specified.");
    }

    if (vendor.partnerId) {
      ensurePartnerAuthorization(this.context.viewer, vendor.partnerId, true);
    } else {
      ensureAdmin(this.context.viewer);
    }

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
    })) as UpdateVendorUserInput;

    const vendorUser = await VendorUser.query().patchAndFetchById(
      vendorUserId,
      validatedUpdates
    );

    return vendorUser;
  }
}
