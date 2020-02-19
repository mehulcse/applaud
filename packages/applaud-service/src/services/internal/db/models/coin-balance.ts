import { Model } from "objection";

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
