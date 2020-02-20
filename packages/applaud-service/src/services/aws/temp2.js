let nodemailer = require('nodemailer');
let AWS = require('aws-sdk');
// import Config from "../../config";

// export function getSESClient() {
  // const defaultSettings: Partial<AWS.SES.ClientConfiguration> = {
  //   apiVersion: "2010-12-01",
  //   region: "us-west-2"
  // };
  AWS.config.update({
    accessKeyId: "AKIAYUYXAEARLQYZHKVA",
    secretAccessKey: "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",
    region: 'us-west-2',
  });
  let transporter = nodemailer.createTransport({
    SES: new AWS.SES({
      apiVersion: '2010-12-01'
    })
  });

  transporter.sendMail({
    from: 'mehulthakkar02@gmail.com',
    to: 'mehulthakkar02@gmail.com',
    subject: 'Message',
    text: 'I hope this message gets sent!'
  }, (err, info) => {
    console.log(info);
    console.log(err);
    console.log(info.envelope);
    console.log(info.messageId);
  });
  // if (Config.getIsLocal()) {
  //   return new aws.SES({
  //     ...defaultSettings,
  //     // credentials: new SharedIniFileCredentials({
  //     //   profile: Config.getAwsProfileName()
  //     // })
  //   });
  // }

  // return new aws.SES(defaultSettings);
// }
//
// getSESClient();
