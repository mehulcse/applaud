import { Model } from "objection";

class UserRole extends Model {
  static get tableName() {
    return "userRoles";
  }

  id: number;
  userId: number;
  roleId: string;
  createdAt: Date;
}

export default UserRole;
