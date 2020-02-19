import { Model } from "objection";

class CoinReceived extends Model {
  static get tableName() {
    return "coinsReceived";
  }

  id: number;
  balance: number;
  allocatedToUserId: number;
  allocatedByUserId: number;
  testimonyId: number;
}

export default CoinReceived;
