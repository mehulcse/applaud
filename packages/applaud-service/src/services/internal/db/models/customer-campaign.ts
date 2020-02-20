import { Model } from "objection";

export interface CustomerCampaign {
  id: number;
  name: string;
  customerId: number;
  startsAt: Date;
  endsAt: Date;
  amount: number;
  addedByUserId: number;
  createdAt: Date;
  pausedAt: Date | null;
}

export class CustomerCampaignModel extends Model implements CustomerCampaign {
  static get tableName() {
    return "customerCampaigns";
  }

  id: number;
  name: string;
  customerId: number;
  startsAt: Date;
  endsAt: Date;
  amount: number;
  addedByUserId: number;
  createdAt: Date;
  pausedAt: Date | null;
  deletedAt: Date | null;
}
