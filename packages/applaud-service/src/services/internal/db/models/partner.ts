import { Model } from "objection";

class Partner extends Model {
  static get tableName() {
    return "partners";
  }

  id: number;
  name: string;
  createdAt: Date;
}

export default Partner;
