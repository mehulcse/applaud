import { Model } from "objection";

class VendorUser extends Model {
  static get tableName() {
    return "vendorUsers";
  }

  id: number;
  vendorId: number;
  userId: number;
  createdAt: Date;
  addedByUserId: number;
  isActive: boolean;
}

export default VendorUser;
