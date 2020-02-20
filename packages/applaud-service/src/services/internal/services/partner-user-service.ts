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
import PartnerUser from "../db/models/partner-user";
import { UserService } from "./user-service";
import { UserRoleService } from "./user-role-service";
import { ROLES } from "../../../constants";
import { AppContext } from "../../auth/app-context";

export interface PartnerUsersOptions extends PaginationArgs {
  partnerId?: number;
  userId?: number;
  includeInactive?: boolean;
  isAdmin?: boolean;
}

export interface CreatePartnerUserInput {
  partnerId: number;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
}

export interface UpdatePartnerUserInput {
  isActive?: boolean;
  isAdmin?: boolean;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class PartnerUserService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<PartnerUser> {
    const viewer = ensureUser(this.context.viewer);

    const query = PartnerUser.query();
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
    const partnerUser = await query.findById(id);
    return partnerUser || null;
  }

  getAllQuery(options: PartnerUsersOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.partnerId) {
      query.where({ partnerId: options.partnerId });
    }

    if (options.userId) {
      query.where({ userId: options.userId });
    }

    if (!options.includeInactive) {
      query.where({ isActive: !options.includeInactive });
    }

    if (options.isAdmin !== undefined) {
      query.where({ isAdmin: options.isAdmin });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${PartnerUser.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${PartnerUser.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${PartnerUser.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: PartnerUsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: PartnerUsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: PartnerUsersOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreatePartnerUserInput) {
    const viewer = ensurePartnerAuthorization(
      this.context.viewer,
      input.partnerId,
      true
    );

    // Validation
    const schema = yup.object().shape({
      partnerId: yup
        .number()
        .label("Partner ID")
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
        .nullable(false),
      isAdmin: yup
        .boolean()
        .label("Is Admin")
        .required()
        .nullable(false)
        .default(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreatePartnerUserInput;

    let user = await new UserService(this.context).getByEmail(
      validatedInput.email
    );

    if (!!user) {
      const userRoleCount = await new UserRoleService(this.context).getCount({
        userId: user.id,
        roleIds: [ROLES.ADMIN, ROLES.SUPER_ADMIN]
      });
      if (userRoleCount > 0) {
        throw new Error("Unable to add specified user as a partner user.");
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

    let partnerUser = await this.getFirst({
      partnerId: validatedInput.partnerId,
      userId: user.id
    });

    if (partnerUser) {
      return partnerUser;
    }

    partnerUser = await PartnerUser.query().insertAndFetch({
      userId: user.id,
      partnerId: validatedInput.partnerId,
      addedByUserId: viewer.userId,
      isActive: true,
      isAdmin: validatedInput.isAdmin,
      createdAt: moment.utc().toDate()
    });

    return partnerUser;
  }

  async update(partnerUserId: number, updates: UpdatePartnerUserInput) {
    const originalPartnerUser = await this.getById(partnerUserId);
    if (!originalPartnerUser) {
      throw new Error("Invalid Partner User ID specified.");
    }

    ensurePartnerAuthorization(
      this.context.viewer,
      originalPartnerUser.partnerId,
      true
    );

    const schema = yup.object().shape({
      isActive: yup
        .boolean()
        .label("Is Active")
        .notRequired()
        .nullable(false),
      isAdmin: yup
        .boolean()
        .label("Is Admin")
        .notRequired()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdatePartnerUserInput;

    const partnerUser = await PartnerUser.query().patchAndFetchById(
      partnerUserId,
      validatedUpdates
    );

    return partnerUser;
  }
}
