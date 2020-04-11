import { Model } from "objection";

class UserDetail extends Model {
  static get tableName() {
    return "userDetails";
  }

  id: number;
  userId: number;
  slackHandle: string;
}

export default UserDetail;
