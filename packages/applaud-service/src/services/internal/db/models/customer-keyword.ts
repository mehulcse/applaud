import { Model } from "objection";

class CustomerKeyword extends Model {
  static get tableName() {
    return "customerKeyword";
  }

  id: number;
  customerId: number;
  name: string;
  createdAt: Date;
  addedByUserId: number;
  isActive: boolean;
}

export default CustomerKeyword;
