import { Model } from "objection";

export interface VendorTaskType {
  id: number;
  vendorId: number;
  taskTypeId: string;
  createdAt: Date;
}

class VendorTaskTypeModel extends Model implements VendorTaskType {
  static get tableName() {
    return "vendorTaskTypes";
  }

  id: number;
  vendorId: number;
  taskTypeId: string;
  createdAt: Date;
}

export default VendorTaskTypeModel;
