import { Model } from "objection";

class PartnerProductPrice extends Model {
  static get tableName() {
    return "partnerProductPrices";
  }

  id: number;
  partnerProductId: number;
  startsAt: Date;
  price: number;
  createdAt: Date;
  addedByUserId: number;
  deletedAt: Date | null;
}

export default PartnerProductPrice;
