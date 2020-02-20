import { Model } from "objection";

class DepartmentTeam extends Model {
  static get tableName() {
    return "departmentTeams";
  }

  id: number;
  teamId: number;
  departmentId: number;
  createdAt: Date;
}

export default DepartmentTeam;
