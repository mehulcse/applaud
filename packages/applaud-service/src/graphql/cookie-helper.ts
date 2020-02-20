import moment from "moment";
import { sign } from "jsonwebtoken";
import Config from "../config";
import { AUTH_COOKIE_NAME } from "../constants";
import { GraphQLContext } from "../types/graphql-context";

export async function setAuthCookie(context: GraphQLContext, userId: number) {
  const jwtSecret = Config.getJwtSecret();
  // Make all tokens expire each Saturday at 11:59:59 PM
  const expirationDate = moment()
    .add(1, "week")
    .startOf("week")
    .add(-1, "second");

  const secondsUntilExpiration = expirationDate.diff(moment(), "seconds");

  const ourToken = sign({}, jwtSecret, {
    expiresIn: secondsUntilExpiration,
    subject: userId.toString(),
    issuer: "alita"
  });

  if (context.response) {
    context.response.cookie(AUTH_COOKIE_NAME, ourToken, {
      httpOnly: true,
      domain: Config.getIsLocal() ? "localhost" : Config.getRootDomain(),
      secure: Config.getIsLocal() ? false : true,
      expires: expirationDate.toDate()
    });
  } else {
    context.cookiesToAdd = [
      {
        name: AUTH_COOKIE_NAME,
        value: ourToken,
        httpOnly: true,
        domain: Config.getIsLocal() ? "localhost" : Config.getRootDomain(),
        secure: Config.getIsLocal() ? false : true,
        expires: expirationDate.toDate()
      }
    ];
  }
}
