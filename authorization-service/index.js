const Koa = require("koa");
const Router = require("@koa/router");
const fetch = require("cross-fetch");
const jwt = require("jsonwebtoken");

const app = new Koa();

const router = Router();

router.post("/authorize", (ctx) => {
  const serviceScope = "email openid profile";
  // auth checks - check access token expiry, match the scopes, check the role/group mapping on scopes
  let claimedScope;
  let accessToken;
  if (ctx.request.headers["x-scope"]) {
    claimedScope = ctx.request.headers["x-scope"]
      .split(" ")
      .map((scopeFragment) => scopeFragment.trim())
      .filter(Boolean)
      .sort()
      .join(" ");
  }
  if (ctx.request.headers["authorization"]) {
    accessToken = ctx.request.headers["authorization"]
      ?.split("Bearer")[1]
      .trim();
  }

  let isAuthz = false;
  if (accessToken && claimedScope === serviceScope) {
    isAuthz = true;
  }
  ctx.response.status = isAuthz ? 200 : 401;
  ctx.body = {
    authorized: isAuthz,
  };
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8000);
