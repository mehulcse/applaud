import { Model } from "objection";

class UserTemporaryLoginCode extends Model {
  static get tableName() {
    return "userTemporaryLoginCodes";
  }

  id: number;
  userId: number;
  code: string;
  createdAt: Date;
  expiresAt: Date;
}

export default UserTemporaryLoginCode;
