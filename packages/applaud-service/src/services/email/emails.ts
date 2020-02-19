import nodemailer, { SendMailOptions } from "nodemailer";
import config from "../../config";
import { getSESClient } from "../aws";
import Handlebars from "handlebars";
import fs from "fs";
const previewEmail = require("preview-email");
import htmlToText from "html-to-text";

import path from "path";

import { getLogger } from "../../logger";

const logger = getLogger("emails");

export const sendEmailTemporaryLoginCode = async (
  to: string,
  code: string,
  magicLink: string
) => {
  logger.debug("Generating temporary code email");
  const templateString = await getTemplateString("login-temporary-code");
  const template = Handlebars.compile(templateString);
  const html = template({ temporaryCode: code, magicLink });
  logger.debug(code)
  const message: SendMailOptions = {
    from: "no-reply@thegeekstribe.com",
    to,
    subject: "Temporary Login Code",
    html,
    text: htmlToText.fromString(html)
  };

  const transporter = nodemailer.createTransport({
    SES: getSESClient()
  });
  if (config.getIsLocal()) {
    await previewEmail(message);
  } else {
    await transporter.sendMail(message);
  }
};

export const getTemplateString = (name: string) => {
  return new Promise((resolve, reject) => {
    const filePath = path.resolve(__dirname, "templates", `${name}.html`);
    logger.debug(`Reading template file ${filePath}...`);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data.toString());
    });
  });
};
