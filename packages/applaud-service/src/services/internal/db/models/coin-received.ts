import { Model } from "objection";

export const CARD_TYPES = {
  THANK_YOU: {
    id: "thankYou",
    name: "Thank You"
  },
  CONGRATULATION: {
    id: "congrats",
    name: "Congratulation"
  },
  ABOVE_AND_BEYOND: {
    id: "aboveBeyond",
    name: "Above And Beyond"
  },
  WELL_DONE: {
    id: "wellDone",
    name: "Well Done"
  },
  NINJA: {
    id: "ninja",
    name: "Ninja"
  },
  GLADIATOR: {
    id: "gladiator",
    name: "Gladiator"
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
