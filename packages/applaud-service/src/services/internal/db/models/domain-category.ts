import { Model } from "objection";

class DomainCategory extends Model {
  static get tableName() {
    return "domainCategories";
  }

  id: string;
  categoryId: number;
  domainId: string;
  deletedAt: Date | null;
}

export default DomainCategory;
