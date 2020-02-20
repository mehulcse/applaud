import express from "express";
import { AppContext } from "../services/auth/app-context";

export interface RequestWithContext extends express.Request {
  context?: AppContext;
}
