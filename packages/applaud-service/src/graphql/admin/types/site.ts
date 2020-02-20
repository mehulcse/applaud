import Site, {
  SITE_DEPLOY_STATUS,
  SiteDeployStatus
} from "../../../services/internal/db/models/site";

export default {
  Site: {
    deployStatus: async (
      site: Site,
      _args: any
    ): Promise<SiteDeployStatus | null> => {
      const siteDeployStatus = Object.entries(SITE_DEPLOY_STATUS).find(
        arr => arr[1].id === site.deployStatus
      );
      if (siteDeployStatus) {
        return siteDeployStatus[1];
      }
      throw new Error("Invalid deploy status for site.");
    }
  }
};
