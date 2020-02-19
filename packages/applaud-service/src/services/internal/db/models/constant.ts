import { Model } from "objection";

class Constant extends Model {
  static get tableName() {
    return "constants";
  }

  id: number;
  name: string;
  value: string;
}

export default Constant;
