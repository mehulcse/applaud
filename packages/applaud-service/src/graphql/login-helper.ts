import { OAuth2Client } from "google-auth-library";
import moment from "moment";
import Config from "../config";
import { UserService } from "../services/internal/services/user-service";
import { GraphQLContext } from "../types/graphql-context";
import { getSystemViewer } from "../services/auth/helpers";
import { Viewer } from "../services/auth/viewer";
import { setAuthCookie } from "./cookie-helper";
import { UserTemporaryLoginCodeService } from "../services/internal/services/user-temporary-login-code-service";
import { getLogger } from "../logger";
import { sendEmailTemporaryLoginCode } from "../services/email";

const logger = getLogger("login-helper");

interface LoginResponse {
  isLoggedIn: boolean;
}

let SYSTEM_VIEWER: Viewer;

const getSystemUserContext = async (context: GraphQLContext) => {
  if (!SYSTEM_VIEWER) {
    SYSTEM_VIEWER = await getSystemViewer();
  }
  return { ...context.context, viewer: SYSTEM_VIEWER };
};

export async function loginWithGoogleToken(
  context: GraphQLContext,
  googleIdToken: string
): Promise<LoginResponse> {
  const systemContext = await getSystemUserContext(context);
  const googleClientId = Config.getGoogleClientId();
  const googleAuthClient = new OAuth2Client(googleClientId);
  try {
    const ticket = await googleAuthClient.verifyIdToken({
      idToken: googleIdToken,
      audience: googleClientId
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return { isLoggedIn: false };
    }

    const user = await new UserService(systemContext).getByEmail(payload.email);

    if (!user) {
      return { isLoggedIn: false };
    }

    await setAuthCookie(context, user.id);
    return { isLoggedIn: true };
  } catch (e) {
    logger.error("Error processing Auth Token", { e });
    return { isLoggedIn: false };
  }
}

export async function loginWithMagicLink(
  context: GraphQLContext,
  magicLink: string
): Promise<LoginResponse> {
  const systemContext = await getSystemUserContext(context);
  const decoded = Buffer.from(magicLink, "base64").toString("ascii");
  if (!decoded.includes("|")) {
    return { isLoggedIn: false };
  }
  const [email, temporaryLoginCode] = decoded.split("|");
  const user = await new UserService(systemContext).getByEmail(email);
  if (!user) {
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
}

export async function loginWithEmailAndCode(
  context: GraphQLContext,
  email: string,
  code: string
): Promise<LoginResponse> {
  const systemContext = await getSystemUserContext(context);
  const user = await new UserService(systemContext).getByEmail(email);
  if (!user) {
    return { isLoggedIn: false };
  }
  const userTemporaryLoginCode = await new UserTemporaryLoginCodeService(
    systemContext
  ).getByUserIdAndCode(user.id, code);

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
}

export async function loginWithEmail(
  context: GraphQLContext,
  email: string,
  emailBaseUrl: string
): Promise<LoginResponse> {
  const systemContext = await getSystemUserContext(context);
  // Lookup user first
  const user = await new UserService(systemContext).getByEmail(email);

  if (!user) {
    return { isLoggedIn: false };
  }

  const userTemporaryLoginCode = await new UserTemporaryLoginCodeService(
    systemContext
  ).create({
    userId: user.id
  });

  if (Config.isProduction()) {
    // send email
  } else {
    const magicLink = Buffer.from(
      `${user.email}|${userTemporaryLoginCode.code}`
    ).toString("base64");
    const url = `${emailBaseUrl}/login/${magicLink}`;
    sendEmailTemporaryLoginCode(user.email, userTemporaryLoginCode.code, url);
  }
  return { isLoggedIn: false };
}
