import {
  APP_ADMIN_SUBDOMAIN,
  API_SUBDOMAIN
} from "./constants";

export default class Config {
  private static getParameter = (
    name: string,
    defaultValue: string = ""
  ): string => {
    return process.env[name] || defaultValue;
  };
  static getEnvironment = () => {
    if (Config.getIsLocal()) {
      return "local";
    }
    return Config.getParameter("ENVIRONMENT");
  };
  static getDbHost = () => Config.getParameter("DB_HOST");
  static getDbName = () => Config.getParameter("DB_NAME");
  static getDbPassword = () => Config.getParameter("DB_PASSWORD");
  static getDbPort = () => Config.getParameter("DB_PORT");
  static getDbUser = () => Config.getParameter("DB_USER");
  static getJwtSecret = () => Config.getParameter("JWT_SECRET");
  static getGoogleClientId = () => Config.getParameter("GOOGLE_CLIENT_ID");
  static getGoogleClientSecret = () =>
    Config.getParameter("GOOGLE_CLIENT_SECRET");
  static isProduction = () => Config.getParameter("ENVIRONMENT") === "prod";
  static getDebugSql = () => Config.getParameter("DEBUG_SQL", "false");
  static getRootDomain = () => Config.getParameter("ROOT_DOMAIN");
  static getSqsQueueEndpoint = () => Config.getParameter("SQS_QUEUE_ENDPOINT");
  static getIsLocal = () => Config.getParameter("IS_LOCAL") !== "";
  static getProcess = () => Config.getParameter("PROCESS");
  static getAppAdminDomain = () => {
    if (Config.getIsLocal()) {
      return "localhost:3000";
    }
    const isProduction = Config.getParameter("ENVIRONMENT") === "prod";
    const subdomain = isProduction
      ? APP_ADMIN_SUBDOMAIN
      : `${APP_ADMIN_SUBDOMAIN}-${Config.getParameter("ENVIRONMENT")}`;
    return `${subdomain}.${Config.getParameter("ROOT_DOMAIN")}`;
  };
  static getApiDomain = () => {
    if (Config.getIsLocal()) {
      return "localhost:4000";
    }
    const isProduction = Config.getParameter("ENVIRONMENT") === "prod";
    const subdomain = isProduction
      ? API_SUBDOMAIN
      : `${API_SUBDOMAIN}-${Config.getParameter("ENVIRONMENT")}`;
    return `${subdomain}.${Config.getParameter("ROOT_DOMAIN")}`;
  };
  static getApiUrl = () => {
    const scheme = Config.getIsLocal() ? "http" : "https";
    return `${scheme}://${Config.getApiDomain()}`;
  };
  static getAppAdminUrl = () => {
    const scheme = Config.getIsLocal() ? "http" : "https";
    return `${scheme}://${Config.getAppAdminDomain()}`;
  };
  // static getAppPartnerDomain = () => {
  //   if (Config.getIsLocal()) {
  //     return "localhost:3001";
  //   }
  //   const isProduction = Config.getParameter("ENVIRONMENT") === "prod";
  //   const subdomain = isProduction
  //     ? APP_PARTNER_SUBDOMAIN
  //     : `${APP_PARTNER_SUBDOMAIN}-${Config.getParameter("ENVIRONMENT")}`;
  //   return `${subdomain}.${Config.getParameter("ROOT_DOMAIN")}`;
  // };
  // static getAppPartnerUrl = () => {
  //   const scheme = Config.getIsLocal() ? "http" : "https";
  //   return `${scheme}://${Config.getAppPartnerDomain()}`;
  // };
  // static getAppWorkerDomain = () => {
  //   if (Config.getIsLocal()) {
  //     return "localhost:3002";
  //   }
  //   const isProduction = Config.getParameter("ENVIRONMENT") === "prod";
  //   const subdomain = isProduction
  //     ? APP_WORKER_SUBDOMAIN
  //     : `${APP_WORKER_SUBDOMAIN}-${Config.getParameter("ENVIRONMENT")}`;
  //   return `${subdomain}.${Config.getParameter("ROOT_DOMAIN")}`;
  // };
  // static getAppWorkerUrl = () => {
  //   const scheme = Config.getIsLocal() ? "http" : "https";
  //   return `${scheme}://${Config.getAppWorkerDomain()}`;
  // };
  static getCorsOrigin = () => {
    return [
      Config.getApiUrl(),
      Config.getAppAdminUrl(),
      // Config.getAppPartnerUrl(),
      // Config.getAppWorkerUrl()
    ];
  };
  static getAwsProfileName = () => Config.getParameter("AWS_PROFILE");
  static getAwsAccessKey = () => Config.getParameter("AWS_ACCESS_KEY_ID");
  static getAwsSecretKey = () => Config.getParameter("AWS_SECRET_KEY_ID");
  static getAwsRegion = () => Config.getParameter("AWS_REGION");
  static getBugsnagApiKey = () => Config.getParameter("BUGSNAG_API_KEY");
}
