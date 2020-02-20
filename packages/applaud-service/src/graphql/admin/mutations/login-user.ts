import moment from "moment";
import { OAuth2Client } from "google-auth-library";
import { getLogger } from "../../../logger";
import config from "../../../config";
import { GraphQLContext } from "../../../types/graphql-context";
import { sendEmailTemporaryLoginCode } from "../../../services/email";
import { UserTemporaryLoginCodeService } from "../../../services/internal/services/user-temporary-login-code-service";
import { setAuthCookie } from "../../cookie-helper";
import { getSystemViewer } from "../../../services/auth/helpers";
import { UserService } from "../../../services/internal/services/user-service";
import { UserRoleService } from "../../../services/internal/services/user-role-service";
import { ROLES } from "../../../constants";

const logger = getLogger("login-user.ts");

interface Args {
  input: {
    email?: string;
    temporaryLoginCode?: string;
    googleIdToken?: string;
    magicLink?: string;
  };
}

export default {
  Mutation: {
    loginUser: async (
      _parent: any,
      args: Args,
      context: GraphQLContext
    ): Promise<{ isLoggedIn: boolean }> => {
      const viewer = await getSystemViewer();
      const systemContext = { ...context.context, viewer };
      if (args.input.googleIdToken) {
        const googleClientId = config.getGoogleClientId();
        const googleAuthClient = new OAuth2Client(googleClientId);
        try {
          const ticket = await googleAuthClient.verifyIdToken({
            idToken: args.input.googleIdToken,
            audience: googleClientId
          });
          const payload = ticket.getPayload();

          if (!payload || !payload.email) {
            return { isLoggedIn: false };
          }

          const user = await new UserService(systemContext).getByEmail(
            payload.email
          );

          if (!user) {
            return { isLoggedIn: false };
          }

          const userRoles = await new UserRoleService(systemContext).getAll({
            userId: user.id
          });
          const isAdmin = !!userRoles.find(x => x.roleId === ROLES.ADMIN);
          const isSuperAdmin = !!userRoles.find(
            x => x.roleId === ROLES.SUPER_ADMIN
          );

          if (!isAdmin && !isSuperAdmin) {
            return { isLoggedIn: false };
          }

          await setAuthCookie(context, user.id);
          return { isLoggedIn: false };
        } catch (e) {
          logger.error("Error processing Auth Token", { e });
          return { isLoggedIn: false };
        }
      } else if (args.input.magicLink) {
        const decoded = Buffer.from(args.input.magicLink, "base64").toString(
          "ascii"
        );
        if (!decoded.includes("|")) {
          return { isLoggedIn: false };
        }
        const [email, temporaryLoginCode] = decoded.split("|");
        const user = await new UserService(systemContext).getByEmail(email);
        if (!user) {
          return { isLoggedIn: false };
        }

        const userRoles = await new UserRoleService(systemContext).getAll({
          userId: user.id
        });
        const isAdmin = !!userRoles.find(x => x.roleId === ROLES.ADMIN);
        const isSuperAdmin = !!userRoles.find(
          x => x.roleId === ROLES.SUPER_ADMIN
        );

        if (!isAdmin && !isSuperAdmin) {
          return { isLoggedIn: false };
        }

        const userTemporaryLoginCode = await new UserTemporaryLoginCodeService(
          systemContext
        ).getByUserIdAndCode(user.id, temporaryLoginCode);

        if (!userTemporaryLoginCode) {
          return { isLoggedIn: false };
        }

        if (userTemporaryLoginCode.expiresAt < moment.utc().toDate()) {
          return { isLoggedIn: false };
        }

        await new UserTemporaryLoginCodeService(systemContext).delete(
          userTemporaryLoginCode.id
        );

        await setAuthCookie(context, user.id);

        return { isLoggedIn: true };
      } else if (args.input.email && args.input.temporaryLoginCode) {
        const user = await new UserService(systemContext).getByEmail(
          args.input.email
        );
        if (!user) {
          return { isLoggedIn: false };
        }

        const userRoles = await new UserRoleService(systemContext).getAll({
          userId: user.id
        });
        const isAdmin = !!userRoles.find(x => x.roleId === ROLES.ADMIN);
        const isSuperAdmin = !!userRoles.find(
          x => x.roleId === ROLES.SUPER_ADMIN
        );

        if (!isAdmin && !isSuperAdmin) {
          return { isLoggedIn: false };
        }

        const userTemporaryLoginCode = await new UserTemporaryLoginCodeService(
          systemContext
        ).getByUserIdAndCode(user.id, args.input.temporaryLoginCode);

        if (!userTemporaryLoginCode) {
          return { isLoggedIn: false };
        }

        if (userTemporaryLoginCode.expiresAt < moment.utc().toDate()) {
          return { isLoggedIn: false };
        }

        await new UserTemporaryLoginCodeService(systemContext).delete(
          userTemporaryLoginCode.id
        );

        await setAuthCookie(context, user.id);

        return { isLoggedIn: true };
      } else if (args.input.email) {
        // Lookup user first
        const user = await new UserService(systemContext).getByEmail(
          args.input.email
        );

        if (!user) {
          return { isLoggedIn: false };
        }

        const userTemporaryLoginCode = await new UserTemporaryLoginCodeService(
          systemContext
        ).create({
          userId: user.id
        });

        if (config.isProduction()) {
          // send email
        } else {
          const magicLink = Buffer.from(
            `${user.email}|${userTemporaryLoginCode.code}`
          ).toString("base64");
          const url = `${config.getAppAdminUrl()}/login/${magicLink}`;
          await sendEmailTemporaryLoginCode(
            user.email,
            userTemporaryLoginCode.code,
            url
          );
        }
      }

      return { isLoggedIn: false };
    }
  }
};
