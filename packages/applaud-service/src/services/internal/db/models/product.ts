import { Model } from "objection";

class Product extends Model {
  static get tableName() {
    return "products";
  }

  id: string;
  name: string;
  defaultWholesalePrice: number;
  isKeywordRequired: boolean;
}

export default Product;
