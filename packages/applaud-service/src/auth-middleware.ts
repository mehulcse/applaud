import express from "express";
import { AUTH_COOKIE_NAME } from "./constants";
import { RequestWithContext } from "./types/request-with-context";
import { getViewer } from "./services/auth/viewer";
import { AppContext } from "./services/auth/app-context";

export default async (
  req: RequestWithContext,
  _res: express.Response,
  next: express.NextFunction
) => {
  const context: AppContext = {
    requestId: "new", // TODO: generate a guid
    viewer: null
  };

  // If an "Authorization" header is not present on the request, skip processing and forward request to next middleware
  if (!req.cookies[AUTH_COOKIE_NAME]) {
    req.context = context;
    return next();
  }

  context.viewer = await getViewer({
    jwtToken: req.cookies[AUTH_COOKIE_NAME],
    requestId: context.requestId
  });

  req.context = context;

  return next();
};
