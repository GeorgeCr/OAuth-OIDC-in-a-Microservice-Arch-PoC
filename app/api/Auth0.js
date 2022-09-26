const Auth = require("./Auth");
const fetch = require("cross-fetch");

class Auth0 extends Auth {
  async getTokens(code, clientId, clientSecret) {
    const token = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const result = await fetch(
      "https://dev-3w0up8av.us.auth0.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          redirect_uri: "http://localhost:8080/auth/callback",
          client_id: clientId,
          client_secret: clientSecret
        }),
      }
    );
    if (result.status >= 400) {
      const text = await result.text();
      throw new Error(text);
    }
    return result.json();
  }
}

module.exports = Auth0;
