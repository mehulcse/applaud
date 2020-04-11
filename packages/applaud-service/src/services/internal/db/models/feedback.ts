import { Model } from "objection";

class Feedback extends Model {
  static get tableName() {
    return "feedbacks";
  }

  id: number;
  userId: number;
  feedback: string;
  isActive: boolean;
}

export default Feedback;
