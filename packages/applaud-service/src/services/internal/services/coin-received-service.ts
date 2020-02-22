import moment from "moment";
import * as yup from "yup";
import axios from "axios";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import { getLogger } from "../../../logger";
import {
  handlePagination,
  executeSelectFirst,
  executeSelectCount,
  executeSelectAll
} from "../helpers";
import { UserService } from "./user-service";
import CoinReceived from "../db/models/coin-received";
import { ensureUser } from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";
import { CARD_TYPES } from "../db/models/coin-received";
import { CoinBalanceService } from "./coin-balance-service";
import Config from "../../../config";

export interface CoinReceivedOptions extends PaginationArgs {
  allocatedToUserId?: number;
  allocatedByUserId?: number;
}

export interface CreateCoinReceivedInput {
  balance: number;
  allocatedToUserId: number;
  allocatedByUserId: number;
  message?: string;
  type: string;
}

const SORTS = {
  ID_ASC: "ID_ASC",
  ID_DESC: "ID_DESC"
};

const logger = getLogger("slackNotifications");

export class CoinReceivedService {
  readonly context: AppContext;

  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<CoinReceived> {
    ensureUser(this.context.viewer);
    const query = CoinReceived.query();
    return {
      query
    };
  }

  async getById(id: number) {
    const { query } = this.initializeAuthorizedQuery();
    const coinReceived = await query.findById(id);
    return coinReceived || null;
  }

  getAllQuery(options: CoinReceivedOptions) {
    const { query } = this.initializeAuthorizedQuery();

    handlePagination(query, options);

    if (options.allocatedToUserId) {
      query.where({ allocatedToUserId: options.allocatedToUserId });
    }

    if (options.allocatedByUserId) {
      query.where({ allocatedByUserId: options.allocatedByUserId });
    }

    switch (options.sort) {
      case SORTS.ID_ASC:
        query.orderBy(`${CoinReceived.tableName}.id`, "asc");
        break;
      case SORTS.ID_DESC:
        query.orderBy(`${CoinReceived.tableName}.id`, "desc");
        break;
      default:
        query.orderBy(`${CoinReceived.tableName}.createdAt`, "desc");
        break;
    }

    return query;
  }

  async getFirst(options: CoinReceivedOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectFirst(query);
  }

  async getCount(options: CoinReceivedOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectCount(query);
  }

  async getAll(options: CoinReceivedOptions) {
    const query = this.getAllQuery(options);
    return await executeSelectAll(query);
  }

  async create(input: CreateCoinReceivedInput) {
    ensureUser(this.context.viewer);
    // Validation
    const schema = yup.object().shape({
      balance: yup
        .number()
        .label("Balance")
        .required()
        .nullable(false),
      allocatedToUserId: yup
        .number()
        .label("Allocated To User Id")
        .required()
        .nullable(false),
      allocatedByUserId: yup
        .number()
        .label("Allocated By User Id")
        .required()
        .nullable(false),
      message: yup
        .string()
        .label("Message")
        .min(1)
        .max(255),
      type: yup
        .string()
        .label("Type")
        .required()
        .nullable(false)
        .oneOf(Object.values(CARD_TYPES).map(card => card.id))
    });
    const validatedInput = (await schema.validate(input, {
      abortEarly: false,
      stripUnknown: true
    })) as CreateCoinReceivedInput;

    const allocatedToUser = await new UserService(this.context).getById(
      validatedInput.allocatedToUserId
    );

    if (!allocatedToUser) {
      throw new Error("Invalid Allocated To User ID specified.");
    }

    const allocatedByUser = await new UserService(this.context).getById(
      validatedInput.allocatedByUserId
    );

    if (!allocatedByUser) {
      throw new Error("Invalid Allocated By User ID specified.");
    }

    const coinBalance = await new CoinBalanceService(this.context).getFirst({
      userId: validatedInput.allocatedByUserId
    });

    // check the available coins quantity
    if (!coinBalance || coinBalance.balance < validatedInput.balance) {
      throw new Error("Not enough claps available.");
    }

    const coinReceived = await CoinReceived.query().insertAndFetch({
      balance: validatedInput.balance,
      allocatedToUserId: validatedInput.allocatedToUserId,
      allocatedByUserId: validatedInput.allocatedByUserId,
      message: validatedInput.message,
      type: validatedInput.type,
      createdAt: moment.utc().toDate()
    });

    const balanceCoins = coinBalance.balance - validatedInput.balance;

    // Reduce the coins quantity
    await new CoinBalanceService(this.context).update(coinBalance.id, {
      balance: balanceCoins
    });

    logger.debug(CoinBalanceService);

    // Slack trigger
    const url = Config.getSlackEndpoint();

    logger.debug(url);
    const notificationMessage = {
      unfurl_links: true,
      text: `<@${allocatedToUser.email.substring(
        0,
        allocatedToUser.email.indexOf("@")
      )}>, You have been applauded by a fellow :tech9:er \n\n`,
      mrkdwn: true,
      blocks: [
        {
          type: "section",
          block_id: "descriptionSection",
          text: {
            type: "mrkdwn",
            text: `<@${allocatedToUser.email.substring(
              0,
              allocatedToUser.email.indexOf("@")
            )}>, You have been applauded by a fellow :tech9:er \n\n > ${
              validatedInput.message
            }\n\nLogin to <http://thegeekstribe.com/dashboard|Applaud> \n\n`
          },
          accessory: {
            type: "image",
            image_url:
              "https://s3-us-west-2.amazonaws.com/applaud.chat/Applaud-logo.png",
            alt_text: "Kudos"
          }
        }
      ]
    };

    const res = await axios.post(url, JSON.stringify(notificationMessage));
    logger.debug("slack response :", res);

    return coinReceived;
  }
}
