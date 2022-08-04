export class AuthTokenError extends Error {
  constructor() {
    super("Error with autentication token.");
  }
}
