import { Model } from "objection";

class Role extends Model {
  static get tableName() {
    return "roles";
  }

  id: string;
  name: string;
}

export default Role;
