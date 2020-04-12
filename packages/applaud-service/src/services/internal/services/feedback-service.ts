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
import { UserService } from "./user-service";
import Feedback from "../db/models/feedback";
import { AppContext } from "../../auth/app-context";

export interface FeedbackOptions extends PaginationArgs {
  userId?: number;
}

export interface CreateFeedbackInput {
  feedback: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class FeedbackService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<Feedback> {
    ensureUser(this.context.viewer);

    const query = Feedback.query();

    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const feedback = await query.findById(id);
    return feedback || null;
  }

  getAllQuery(options: FeedbackOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.userId) {
      query.where({ userId: options.userId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${Feedback.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${Feedback.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${Feedback.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: FeedbackOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: FeedbackOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: FeedbackOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateFeedbackInput) {
    const viewer = ensureUser(this.context.viewer);

    const schema = yup.object().shape({
      feedback: yup
        .string()
        .label("Feedback")
        .required()
        .nullable(false)
    });

    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateFeedbackInput;

    const user = await new UserService(this.context).getById(viewer.user.id);

    if (!user) {
      throw new Error("User ID is not valid.");
    }

    const feedback = await Feedback.query().insertAndFetch({
      userId: viewer.user.id,
      feedback: validatedInput.feedback
    });
    return feedback;
  }
}
