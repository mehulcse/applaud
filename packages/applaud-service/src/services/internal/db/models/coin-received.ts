import { Model } from "objection";

export const CARD_TYPES = {
  THANKS_YOU: {
    id: "thankYou",
    name: "Thank You"
  },
  CONGRATULATION: {
    id: "congratulation",
    name: "Congratulation"
  }
};

class CoinReceived extends Model {
  static get tableName() {
    return "coinsReceived";
  }

  id: number;
  balance: number;
  allocatedToUserId: number;
  allocatedByUserId: number;
  message: string;
  type: string;
  createdAt: Date;
}

export default CoinReceived;
