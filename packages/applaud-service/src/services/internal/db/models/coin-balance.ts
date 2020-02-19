import { Model } from "objection";

export const DEFAULT_BALANCE = 20;

class CoinBalance extends Model {
  static get tableName() {
    return "coinBalance";
  }

  id: number;
  balance: number;
  userId: number;
  allocatedAt: Date;
}

export default CoinBalance;
