export class PartnerRequiredError extends Error {
  constructor(message: string = "Partner must be specified.") {
    super(message);
  }
}
