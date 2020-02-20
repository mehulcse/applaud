import { Model } from "objection";

class SitePost extends Model {
  static get tableName() {
    return "sitePosts";
  }

  id: number;
  siteId: string | null;
  title: string;
  content: string;
  createdAt: Date;
  lastUpdatedAt: Date | null;
  addedByUserId: number;
  deletedAt: Date | null;
}

export default SitePost;
