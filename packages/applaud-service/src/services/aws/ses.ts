import aws from "aws-sdk";
import Config from "../../config";

export function getSESClient() {
  const defaultSettings: Partial<aws.SES.ClientConfiguration> = {
    apiVersion: "2010-12-01",
    region: "us-west-2"
  };
  aws.config.update({
    accessKeyId: Config.getAwsAccessKey(),
    secretAccessKey: Config.getAwsSecretKey(),
    region: Config.getAwsRegion(),
  });
  if (Config.getIsLocal()) {
    return new aws.SES({
      ...defaultSettings,
      // credentials: new SharedIniFileCredentials({
      //   profile: Config.getAwsProfileName()
      // })
    });
  }

  return new aws.SES(defaultSettings);
}
