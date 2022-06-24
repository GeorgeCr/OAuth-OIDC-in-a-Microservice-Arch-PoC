const Koa = require("koa");
const Router = require("@koa/router");
const jwt = require("jsonwebtoken");
const fetch = require("cross-fetch");

const app = new Koa();

const router = Router();

router.post("/authenticate", async (ctx) => {
  // auth checks - check id token sig, check the role/group
  // const idToken = ctx.headers["x-id-token"];
  console.log("headrs in authhh", ctx.request.headers);
  const idToken = ctx.request.headers["x-id-token"];
  const result = await fetch(
    "https://dev-3w0up8av.us.auth0.com/.well-known/jwks.json"
  );
  const jwtWebKeySet = await result.json();
  console.log(jwtWebKeySet);
  const [firstSet, secondSet] = jwtWebKeySet.keys;
  const publicKey = firstSet.x5c[0];
  console.log("public key", publicKey);
  // const decoded = jwt.verify(
  //   idToken,
  //   `-----BEGIN CERTIFICATE-----
  // MIIDDTCCAfWgAwIBAgIJTk0RSWnkgiaJMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
  // BAMTGWRldi0zdzB1cDhhdi51cy5hdXRoMC5jb20wHhcNMjIwNjIzMjEzMTU0WhcN
  // MzYwMzAxMjEzMTU0WjAkMSIwIAYDVQQDExlkZXYtM3cwdXA4YXYudXMuYXV0aDAu
  // Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAm8yZhvV99lxQ9XE7
  // YuDH+1i6VSU16iQ6mWrNUvjm4P/7WOLyU68GiJ/t0SbdDIlt4VLfLfdywBq0LSAd
  // HzI6oELTmaUxUrHCvlhX/8j3x6zUTuswjke/x+v0V9EvKsKoZz82g9GOQ8YCu126
  // upZYNy5BsErdIibezXVXVLhjUeXri58vagvYQxhAGo6Y+FXc7ccPm8dDZA1Skuq0
  // /WvVE0IqR91Yu0Rijx+3w0G+hr9p55uoWZoMDQTIf6LPb1pw8QnmbhF8xYg13Nr2
  // PJdu23kI5kahHymiGpuO06u5HebJTYU9X2q0cwbR69Zl3DGXG5TCfda5yr5SrNXu
  // OL51NwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBTFYExRV+ld
  // qtvDQai458neDlNFHTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
  // AJstNN6ZOLzw3O7e1T8YnUeqiyE6JYs7AdDY43B632YkSQbgSPf1CxXE6vM0AOCp
  // GchvIxgo3xPgl9v2utdlaZSj3g1aCAi7HzTxN/9FLcD1Bj2vljtV1Y74tr+kuN4G
  // JgIzjPDVJ1ddqXaPHJNoWcsfypjePoWcu8HR8d/RXvp8kGw9jdJX3kPuAUD82kVl
  // 8QpPyBeHmTikvoi5pcR40/9c8uZWoMVrWVdW3Wp+Hak4qevcFU1H4Q2vpVaURnoZ
  // nDMMNadG3ygJat8LPRaGOhYi8R5mzC61Xqt4wyyL91n7fmuANw2s7/BscW0/jAYR
  // IXHmqeWLXWG5LkR0JtFrolk=
  // -----END CERTIFICATE-----`,
  //   {
  //     algorithms: "RS256",
  //   }
  // );
  const decoded = jwt.decode(idToken);
  console.log("decoded token", decoded);
  let isAuth = false;
  if (decoded) {
    isAuth = true;
  }
  ctx.status = isAuth ? 200 : 401;

  ctx.body = isAuth
    ? {
        auth: true,
      }
    : {
        auth: false,
      };
  // send some body too
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(9000);
