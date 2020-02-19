import aws, { SharedIniFileCredentials } from "aws-sdk";
import Config from "../../config";

export function getSESClient() {
  const defaultSettings: Partial<aws.SES.ClientConfiguration> = {
    apiVersion: "2010-12-01",
    region: "us-west-2"
  };
  if (Config.getIsLocal()) {
    return new aws.SES({
      ...defaultSettings,
      credentials: new SharedIniFileCredentials({
        profile: Config.getAwsProfileName()
      })
    });
  }

  return new aws.SES(defaultSettings);
}
