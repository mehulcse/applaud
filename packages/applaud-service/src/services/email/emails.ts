import AWS from "aws-sdk";
import Config from "../../config";
import { getLogger } from "../../logger";

const logger = getLogger("emails");

export const sendEmailTemporaryLoginCode = async (
  to: string,
  code: string,
  magicLink: string
) => {
  logger.debug("Generating temporary code email");
  logger.debug(code);
  AWS.config.update({
    region: Config.getAwsRegion()
  });

  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        to
        /* more items */
      ]
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<!doctype html> <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"> <head> <title></title> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <style type="text/css"> #outlook a{padding:0;}body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table, td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}img{border:0;height:auto;line-height:100%; outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}p{display:block;margin:13px 0;}</style><!--[if mso]> <xml> <o:OfficeDocumentSettings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumentSettings> </xml><![endif]--><!--[if lte mso 11]> <style type="text/css"> .mj-outlook-group-fix{width:100% !important;}</style><![endif]--> <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css"><link href="https://fonts.googleapis.com/css?family=Raleway" rel="stylesheet" type="text/css"> <style type="text/css"> @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);@import url(https://fonts.googleapis.com/css?family=Raleway); </style> <style type="text/css"> @media only screen and (min-width:480px){.mj-column-per-100{width:100% !important; max-width: 100%;}}</style> <style type="text/css"> </style> </head> <body> <div style="" > <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#3fbeed;background-color:#3fbeed;width:100%;" > <tbody> <tr> <td><!--[if mso | IE]> <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" > <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" > <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;" ><!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td class="" style="vertical-align:top;width:600px;" ><![endif]--> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;" > <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%" > <tr> <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;" > <div style="font-family:Raleway;font-size:20px;line-height:1;text-align:left;color:#FFFFFF;" >The Geeks Tribe</div></td></tr></table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table><!--[if mso | IE]> <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" > <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" > <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;" ><!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td class="" style="vertical-align:top;width:600px;" ><![endif]--> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;" > <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%" > <tr> <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;" > <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;" >Here's your temporary code:</div></td></tr><tr> <td align="center" style="background:#cccccc;font-size:0px;padding:20px;word-break:break-word;" > <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:24px;font-weight:bold;line-height:1;text-align:center;color:#000000;">${code}</div></td></tr><tr> <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;" > <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;" > <tr> <td align="center" bgcolor="#3fbeed" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#3fbeed;" valign="middle" > <a href="${magicLink}" style="display:inline-block;background:#3fbeed;color:#ffffff;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;font-weight:normal;line-height:120%;margin:0;text-decoration:none;text-transform:none;padding:10px 25px;mso-padding-alt:0px;border-radius:3px;" target="_blank" > Login with Magic Link </a> </td></tr></table> </td></tr></table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table> </div><!--[if mso | IE]> </td></tr></table> <table align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600" > <tr> <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;"><![endif]--> <div style="margin:0px auto;max-width:600px;"> <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;" > <tbody> <tr> <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;" ><!--[if mso | IE]> <table role="presentation" border="0" cellpadding="0" cellspacing="0"> <tr> <td class="" style="vertical-align:top;width:600px;" ><![endif]--> <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;" > <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%" > <tr> <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;" > <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;" >Yours truly,</div></td></tr><tr> <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;" > <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:13px;line-height:1;text-align:left;color:#000000;" >The Geeks Tribe</div></td></tr></table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </td></tr></tbody> </table> </div><!--[if mso | IE]> </td></tr></table><![endif]--> </div></body> </html>`
        },
        Text: {
          Charset: "UTF-8",
          Data: code
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Temporary Login Code"
      }
    },
    Source: "mehul.thakkar@tech9.com" /* required */,
    ReplyToAddresses: [
      "mehul.thakkar@tech9.com"
      /* more items */
    ]
  };

  const sendPromise = await new AWS.SES({ apiVersion: "2010-12-01" })
    .sendEmail(params)
    .promise();

  logger.debug(params);
  logger.debug(sendPromise);
  logger.debug("mail sent");
  // }
};
