import { Model } from "objection";

export const CONSTANTS = {
  TEAM_MULTIPLIER: "TEAM_MULTIPLIER",
  DEPARTMENT_MULTIPLIER: "DEPARTMENT_MULTIPLIER"
};

class Constant extends Model {
  static get tableName() {
    return "constants";
  }

  id: number;
  name: string;
  value: string;
}

export default Constant;
