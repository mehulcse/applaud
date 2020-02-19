import { Model } from "objection";

class Team extends Model {
  static get tableName() {
    return "teams";
  }

  id: number;
  name: string;
  description: string;
}

export default Team;
