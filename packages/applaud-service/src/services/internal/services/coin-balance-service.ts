import moment from "moment";
import * as yup from "yup";
import Objection from "objection";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { UserService } from "./user-service";
import CoinBalance from "../db/models/coin-balance";
import {
  ensureUser,
  ensureAdmin
} from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";

export interface CoinBalanceOptions extends PaginationArgs {
  userId?: number;
}

export interface CreateCoinBalanceInput {
  userId: number;
  balance: number;
}

export interface UpdateCoinBalanceInput {
  balance: number;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

export class CoinBalanceService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<CoinBalance> {
    const viewer = ensureUser(this.context.viewer);

    const query = CoinBalance.query();
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
    const { query } = this.initializeAuthorizedQuery();
    const coinBalance = await query.findById(id);
    return coinBalance || null;
  }

  getAllQuery(options: CoinBalanceOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.userId) {
      query.where({ userId: options.userId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${CoinBalance.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${CoinBalance.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${CoinBalance.tableName}.id`, "asc");
        break;
    }

    return query;
  }

  async getFirst(options: CoinBalanceOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: CoinBalanceOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: CoinBalanceOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateCoinBalanceInput, trx?: Objection.Transaction) {
    ensureAdmin(this.context.viewer)
    // Validation
    const schema = yup.object().shape({
      userId: yup
        .number()
        .label("User ID")
        .required()
        .nullable(false),
      balance: yup
        .number()
        .label("Balance")
        .required()
        .nullable(false)
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateCoinBalanceInput;

    const user = await new UserService(this.context).getById(
      validatedInput.userId
    );

    if (!user) {
      throw new Error("Invalid User ID specified.");
    }

    let coinBalance = await CoinBalance.query(trx).insertAndFetch({
      userId: user.id,
      balance: validatedInput.balance,
      allocatedAt: moment.utc().toDate()
    });

    return coinBalance;
  }

  async update(coinBalanceId: number, updates: UpdateCoinBalanceInput) {
    const existingCoinBalance = await this.getById(coinBalanceId);
    if (!existingCoinBalance) {
      throw new Error("Invalid Coin Balance ID specified.");
    }

    const schema = yup.object().shape({
      balance: yup
        .number()
        .label("Balance")
        .required()
        .nullable(false)
    });
    const validatedUpdates = (await schema.validate(updates, {
      abortEarly: false,
      stripUnknown: true
    })) as UpdateCoinBalanceInput;

    const coinBalance = await CoinBalance.query().patchAndFetchById(
      coinBalanceId,
      validatedUpdates
    );

    return coinBalance;
  }
}
