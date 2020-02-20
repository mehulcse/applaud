import { Model } from "objection";

class TaskType extends Model {
  static get tableName() {
    return "taskTypes";
  }

  id: string;
  name: string;
}

export default TaskType;
