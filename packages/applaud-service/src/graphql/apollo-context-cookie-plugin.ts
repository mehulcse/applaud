import moment from "moment";
import {
  ApolloServerPlugin,
  WithRequired,
  GraphQLRequestContext
} from "apollo-server-plugin-base";
import { GraphQLContext } from "../types/graphql-context";
import { getLogger } from "../logger";

export const ApolloContextCookiePlugin: ApolloServerPlugin = {
  requestDidStart() {
    return {
      async willSendResponse(
        requestContext: WithRequired<
          GraphQLRequestContext<any>,
          "metrics" | "response"
        >
      ) {
        const http = requestContext?.response?.http;
        if (!http) {
          return;
        }
        const context = requestContext.context as GraphQLContext;
        if (context.cookiesToAdd && context.cookiesToAdd.length > 0) {
          getLogger().debug(`Adding ${context.cookiesToAdd.length} cookies...`);
          // rcm:auth=<value>; Domain=redcanyonmedia.com; Path=/; Expires=Sat, 14 Dec 2019 23:59:59 GMT; HttpOnly; Secure
          const cookieStrings = context.cookiesToAdd.map(cookie => {
            let cookieString = `${cookie.name}=${cookie.value}; `;
            if (cookie.domain) {
              cookieString += `Domain=${
                cookie.domain === "localhost" ? "" : cookie.domain
              }; `;
            }
            // if (cookie.path) {
            cookieString += `Path="/"; `;
            // }
            cookieString += `Expires=${cookie.expires.toUTCString()}; `;
            if (cookie.httpOnly === true) {
              cookieString += "HttpOnly; ";
            }
            // if (cookie.secure === true) {
            //   cookieString += "Secure; ";
            // }
            // cookieString += "SameSite=None; ";
            return cookieString;
          });
          getLogger().debug(cookieStrings);
          cookieStrings.forEach(cookieString => {
            http.headers.set("Set-Cookie", cookieString);
          });
        }

        if (context.cookiesToRemove && context.cookiesToRemove.length > 0) {
          context.cookiesToRemove.forEach(cookieName => {
            http.headers.set(
              "Set-Cookie",
              `${cookieName}=; Expires=${moment
                .utc()
                .add(-1, "month")
                .toDate()
                .toUTCString()}`
            );
          });
        }
      }
    };
  }
};
