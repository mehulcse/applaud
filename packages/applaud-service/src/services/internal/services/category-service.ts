import * as yup from "yup";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { ensureAdmin } from "../../auth/helpers";
import Category from "../db/models/category";
import { AppContext } from "../../auth/app-context";

export interface CategoryOptions extends PaginationArgs {
  search?: string;
  includeInactive?: boolean;
  categoryIds?: number[];
}

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  isActive?: boolean;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class CategoryService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Category> {
    ensureAdmin(this.context.viewer);

    const query = Category.query();

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const category = await query.findById(id);
    return category || null;
  }

  private getAllQuery(options: CategoryOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.search) {
      query.where(`name`, "like", `%${options.search}%`);
    }

    if (!options.includeInactive) {
      query.where({ isActive: !options.includeInactive });
    }

    if (options.categoryIds) {
      query.whereIn("id", options.categoryIds);
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Category.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Category.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Category.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: CategoryOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: CategoryOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: CategoryOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateCategoryInput) {
    ensureAdmin(this.context.viewer);
    // Validation
    const schema = yup.object().shape({
      name: yup
        .string()
        .label("Category Name")
        .min(1)
        .max(255)
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateCategoryInput;

    const category = await Category.query().insertAndFetch({
      name: validatedInput.name,
      isActive: true
    });

    return category;
  }

  async update(categoryId: number, input: UpdateCategoryInput) {
    ensureAdmin(this.context.viewer);
    const existingCategory = await this.getById(categoryId);
    if (!existingCategory) {
      throw new Error("Invalid Category ID specified.");
    }
    // Validation
    const schema = yup.object().shape({
      isActive: yup
        .boolean()
        .label("Is Active")
        .notRequired()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateCategoryInput;

    const category = await Category.query().patchAndFetchById(
      categoryId,
      validatedInput
    );

    return category;
  }
}
