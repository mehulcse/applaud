import { Model } from "objection";

class Category extends Model {
  static get tableName() {
    return "categories";
  }

  id: number;
  name: string;
  isActive: boolean;
}

export default Category;
