export class UnauthorizedAccessError extends Error {
  constructor(message: string = "Unauthorized access.") {
    super(message);
  }
}
