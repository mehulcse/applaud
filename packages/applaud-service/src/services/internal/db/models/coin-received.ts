import { Model } from "objection";

export const CARD_TYPES = {
  THANK_YOU: {
    id: "thankYou",
    name: "Thank You"
  },
  CONGRATULATION: {
    id: "congratulation",
    name: "Congratulation"
  },
  ABOVE_AND_BEYOND: {
      id: "aboveAndBeyond",
      name: "Above And Beyond"
  },
  BRAVO: {
      id: "bravo",
      name: "Bravo"
  },
  MARVELOUS: {
      id: "marvelous",
      name: "Marvelous"
  },
  WELL_DONE: {
      id: "wellDone",
      name: "Well Done"
  },
  WAY_2_GO: {
      id: "way2Go",
      name: "Way 2 Go"
  },
  YOU_ROCK: {
      id: "youRock",
      name: "You Rock"
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