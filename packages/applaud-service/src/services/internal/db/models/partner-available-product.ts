import { Model } from "objection";

class PartnerAvailableProduct extends Model {
  static get tableName() {
    return "partnerAvailableProducts";
  }

  id: number;
  partnerId: number;
  productId: string;
  createdAt: Date;
  wholesalePrice: number;
}

export default PartnerAvailableProduct;
