import { Model } from "objection";

class Customer extends Model {
  static get tableName() {
    return "customers";
  }

  id: number;
  name: string;
  createdAt: Date;
  partnerId: number;
  website: string;
  accountManagerUserId: number | null;
}

export default Customer;
