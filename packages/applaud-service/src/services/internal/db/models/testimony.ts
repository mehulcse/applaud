import { Model } from "objection";

class Testimony extends Model {
  static get tableName() {
    return "testimonies";
  }

  id: number;
  message: string;
  type: string;
  createdAt: Date;
}

export default Testimony;
