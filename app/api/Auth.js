/**
 * @abstract
 */

class Auth {
  constructor() {
    if (this.constructor === Auth) {
      throw new Error("Cannot instantiate Auth abstract class!");
    }
  }

  async getTokens() {}

  async refreshTokens() {}

  async revokeTokens() {}
}

module.exports = Auth;
