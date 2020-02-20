import { Model } from "objection";

class Department extends Model {
  static get tableName() {
    return "departments";
  }

  id: number;
  name: string;
  description: string;
}

export default Department;
