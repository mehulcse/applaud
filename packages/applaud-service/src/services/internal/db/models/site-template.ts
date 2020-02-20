import { Model } from "objection";

class SiteTemplate extends Model {
  static get tableName() {
    return "siteTemplates";
  }

  id: string;
  createdAt: Date;
  name: string;
}

export default SiteTemplate;
