import { Viewer } from "./viewer";

export interface AppContext {
  requestId: string;
  viewer: Viewer | null;
  partnerId: number | null;
  vendorId: number | null;
}
