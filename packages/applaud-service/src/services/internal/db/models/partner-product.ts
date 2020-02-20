import { Model } from "objection";

class PartnerProduct extends Model {
  static get tableName() {
    return "partnerProducts";
  }

  id: number;
  name: string;
  partnerId: number;
  productId: string;
  createdAt: Date;
  activeAt: Date;
  inactiveAt: Date | null;
  addedByUserId: number;
  vendorId: number | null;
  checklistDefinitionId: number | null;
}

export default PartnerProduct;
