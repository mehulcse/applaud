import { Model } from "objection";

export const DOMAIN_STATUS = {
  UNKNOWN: {
    id: "unknown",
    name: "Unknown"
  },
  AVAILABLE: {
    id: "available",
    name: "Available"
  },
  PURCHASED: {
    id: "purchased",
    name: "Purchased"
  },
  UNAVAILABLE: {
    id: "unavailable",
    name: "Unavailable"
  }
};

export class DomainStatus {
  id: string;
  name: string;
}

class Domain extends Model {
  static get tableName() {
    return "domains";
  }

  id: string;
  createdAt: Date;
  status: string;
  availabilityLastCheckedAt: Date | null;
  expiresAt: Date | null;
  purchasedAt: Date | null;
  registrar: string;
  registrarId: string;
  purchasePrice: number;
  puchasedByUserId: number | null;
}

export default Domain;
