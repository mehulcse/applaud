import { Model } from "objection";

class Vendor extends Model {
  static get tableName() {
    return "vendors";
  }

  id: number;
  name: string;
  createdAt: Date;
  partnerId: number | null;
}

export default Vendor;
