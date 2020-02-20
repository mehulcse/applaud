import { Model } from "objection";

class UserTeam extends Model {
  static get tableName() {
    return "userTeams";
  }

  id: number;
  teamId: number;
  userId: number;
  createdAt: Date;
}

export default UserTeam;
