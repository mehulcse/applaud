import { Model } from "objection";

export const CARD_TYPES = {
  THANK_YOU: {
    id: "thankYou",
    name: "Thank You",
    imageURL: "https://s3-us-west-2.amazonaws.com/applaud.chat/Thank_You.png"
  },
  CONGRATULATION: {
    id: "congrats",
    name: "Congratulation",
    imageURL: "https://s3-us-west-2.amazonaws.com/applaud.chat/Congrats.png"
  },
  ABOVE_AND_BEYOND: {
    id: "aboveBeyond",
    name: "Above And Beyond",
    imageURL: "https://s3-us-west-2.amazonaws.com/applaud.chat/AboveAndBeyond.png"
  },
  WELL_DONE: {
    id: "wellDone",
    name: "Well Done",
    imageURL: "https://s3-us-west-2.amazonaws.com/applaud.chat/WellDone.png"
  },
  NINJA: {
    id: "ninja",
    name: "Ninja",
    imageURL: "https://s3-us-west-2.amazonaws.com/applaud.chat/Ninja.png"
  },
  GLADIATOR: {
    id: "gladiator",
    name: "Gladiator",
    imageURL: "https://s3-us-west-2.amazonaws.com/applaud.chat/Gladiator.png"
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
