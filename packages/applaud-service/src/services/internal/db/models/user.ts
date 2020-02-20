import { Model } from "objection";

class User extends Model {
  static get tableName() {
    return "users";
  }

  id: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
}

export default User;
