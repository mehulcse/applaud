import { Model } from "objection";

export const SITE_DEPLOY_STATUS = {
  NOT_DEPLOYED: {
    id: "not_deployed",
    name: "Not Deployed"
  },
  REQUESTED: {
    id: "requested",
    name: "Requested"
  },
  IN_PROGRESS: {
    id: "in_progress",
    name: "In Progress"
  },
  DEPLOYED: {
    id: "deployed",
    name: "Deployed"
  }
};

export class SiteDeployStatus {
  id: string;
  name: string;
}

class Site extends Model {
  static get tableName() {
    return "sites";
  }

  id: string;
  categoryId: number | null;
  lastPublishedAt: Date | null;
  deployStatus: string;
  siteTemplateId: number | null;
}

export default Site;
