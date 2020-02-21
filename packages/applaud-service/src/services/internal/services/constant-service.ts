import * as yup from "yup";
import {PaginationArgs, QueryInitializationResult} from "../common";
import {
  ensureAdmin,
  ensureUser,
} from "../../auth/helpers";
import {AppContext} from "../../auth/app-context";
import Constant from "../db/models/constant";
import {
    handlePagination,
    executeSelectFirst,
    executeSelectCount,
    executeSelectAll
} from "../helpers";

export interface ConstantOptions extends PaginationArgs {
    search?: string;
}

export interface UpdateConstantInput {
  name?: string;
  value?: string;
}

const SORTS = {
    ID_ASC: "ID_ASC",
    ID_DESC: "ID_DESC"
};

export class ConstantService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Constant> {
    const viewer = ensureUser(this.context.viewer);

    const query = Constant.query();

    if (viewer.isAdmin) {
      // No restrictions
    } else {
      throw new Error("Unauthorized access.");
    }

    return {
      query
    };
  }

  async getById(id: number) {
      const {query} = this.initializeAuthorizedQuery();
      const constant = await query.findById(id);
      return constant || null;
  }

  private getAllQuery(options: ConstantOptions) {
      const {query} = this.initializeAuthorizedQuery();

      handlePagination(query, options);

      if (options.search) {
          query.where(`name`, "like", `%${options.search}%`);
      }

      switch (options.sort) {
          case SORTS.ID_ASC:
              query.orderBy(`${Constant.tableName}.name`, "asc");
              break;
          case SORTS.ID_DESC:
              query.orderBy(`${Constant.tableName}.name`, "desc");
              break;
          default:
              query.orderBy(`${Constant.tableName}.name`, "asc");
              break;
      }

      return query;
  }

  async getFirst(options: ConstantOptions) {
      const query = this.getAllQuery(options);
      return await executeSelectFirst(query);
  }

  async getCount(options: ConstantOptions) {
      const query = this.getAllQuery(options);
      return await executeSelectCount(query);
  }

  async getAll(options: ConstantOptions) {
      const query = this.getAllQuery(options);
      return await executeSelectAll(query);
  }

  async update(constantId: number, updates: UpdateConstantInput) {
    ensureAdmin(this.context.viewer);
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Name")
        .min(1)
        .max(255)
        .notRequired()
        .nullable(false),
      value: yup
        .string()
        .label("Value")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateConstantInput;

    const constant = await Constant.query().updateAndFetchById(
      constantId,
      validatedUpdates
    );

    return constant;
  }
}
