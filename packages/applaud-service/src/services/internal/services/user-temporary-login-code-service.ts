import moment from "moment";
import { QueryInitializationResult } from "../common";
import { PaginationArgs } from "../common";
import { UserService } from "./user-service";
import UserTemporaryLoginCode from "../db/models/user-temporary-login-codes";
import { getRandomWords } from "../../../utilities/words";
import { ensureSystemUser } from "../../auth/helpers";
import { AppContext } from "../../auth/app-context";

export interface UserTemporaryLoginCodesOptions extends PaginationArgs {
  userId?: number;
  code?: string;
}

export interface CreateUserTemporaryLoginCodeInput {
  userId: number;
}

export class UserTemporaryLoginCodeService {
  readonly context: AppContext;
  constructor(context: AppContext) {
    this.context = context;
  }

  initializeAuthorizedQuery(): QueryInitializationResult<
    UserTemporaryLoginCode
  > {
    ensureSystemUser(this.context.viewer);
    const query = UserTemporaryLoginCode.query();

    return {
      query
    };
  }

  async getByUserIdAndCode(userId: number, code: string) {
    const { query } = this.initializeAuthorizedQuery();
    const userTemporaryLoginCode = await query.first().where({ userId, code });
    return userTemporaryLoginCode;
  }

  async create(input: CreateUserTemporaryLoginCodeInput) {
    ensureSystemUser(this.context.viewer);
    const user = await new UserService(this.context).getById(input.userId);

    if (!user) {
      throw new Error("Invalid User ID specified.");
    }

    const userTemporaryLoginCode = await UserTemporaryLoginCode.query().insertAndFetch(
      {
        userId: input.userId,
        code: getRandomWords(4).join("-"),
        createdAt: moment.utc().toDate(),
        expiresAt: moment()
          .utc()
          .add(1, "day")
          .toDate()
      }
    );

    return userTemporaryLoginCode;
  }

  async delete(userTemporaryLoginCodeId: number) {
    ensureSystemUser(this.context.viewer);
    await UserTemporaryLoginCode.query().deleteById(userTemporaryLoginCodeId);
  }
}
