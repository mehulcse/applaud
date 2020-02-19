import { Model } from "objection";

class PartnerUser extends Model {
  static get tableName() {
    return "partnerUsers";
  }

  id: number;
  userId: number;
  partnerId: number;
  createdAt: Date;
  addedByUserId: number;
  isActive: boolean;
  isAdmin: boolean;
}

export default PartnerUser;
