import Knex from "knex";
import { Response } from "express";
import { RequestWithContext } from "./request-with-context";
import { AppContext } from "../services/auth/app-context";

interface Cookie {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires: Date;
  httpOnly?: boolean;
  secure?: boolean;
}

export interface GraphQLContext {
  request?: RequestWithContext;
  response?: Response;
  context: AppContext;
  cookiesToAdd?: Cookie[];
  cookiesToRemove?: string[];
}
