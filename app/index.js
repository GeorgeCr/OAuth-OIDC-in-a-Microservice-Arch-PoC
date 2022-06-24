const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("@koa/router");
const Idp = require("./api/Auth0");
const fetch = require("cross-fetch");
const session = require("koa-session");
const cors = require("koa2-cors");
const fs = require("fs");

const sessionConfig = {
  key: "nodejstalks.sess",
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  rolling: true,
  renew: false,
};

const html = fs.readFileSync("./index.html", "utf-8");

const app = new Koa();
app.use(cors());
app.keys = ["new secret key"];
app.use(session(sessionConfig, app));
app.use(bodyParser());
const authRouter = new Router({ prefix: "/auth" });
const commonRouter = new Router();

const CLIENT_ID = "D3uy2sXRXcZtrZWCUKM6DooeDSgeinHh";
const CLIENT_SECRET =
  "CLdFcdhBhp4Yscs7fwCIbDMbnn2dpZoTt-SskDSi1GtDxa7mQ9rkVDWmSJ4MMb0u";
const AUTHZ_URL = `https://dev-3w0up8av.us.auth0.com/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=http://localhost:8080/auth/callback&scope=openid%20email%20profile&state=value`;

authRouter.get("/start", (ctx) => {
  ctx.redirect(AUTHZ_URL);
});

authRouter.get("/callback", async (ctx) => {
  const authProvider = new Idp();
  const authzCode = ctx.query.code;
  const tokens = await authProvider.getTokens(
    authzCode,
    CLIENT_ID,
    CLIENT_SECRET
  );
  const { id_token, access_token, scope } = tokens;
  ctx.session.auth = {
    idToken: id_token,
    accessToken: access_token,
    scope,
  };
  console.log(authzCode);
  console.log(tokens);
  console.log("after saving", ctx.session.auth);
  ctx.body = "Callback - Fetched the tokens";
});

commonRouter.get("/product/add", (ctx) => {
  ctx.body = html;
});

commonRouter.post("/product", async (ctx) => {
  const { name, price } = ctx.request.body;
  // console.log(ctx.session.auth, "authhh");
  console.log(name, price, "data from fe");
  // ctx.session.auth = {};
  const { idToken, accessToken, scope } = ctx.session.auth;
  console.log(ctx.session.auth, "authhh");
  const result = await fetch("http://api-gateway:6000/product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-id-token": idToken,
      "x-scope": scope,
      "x-product-name": name,
      "x-product-price": price,
    },
    body: JSON.stringify({
      name,
      price,
    }),
  });
  const data = await result.json();
  console.log("result here what", data);
  ctx.body = "Received result " + JSON.stringify(data);
});

commonRouter.all("/(.*)", (ctx) => {
  ctx.body = "<div>Hello world</div>";
});

app
  .use(authRouter.routes())
  .use(authRouter.allowedMethods())
  .use(commonRouter.routes())
  .use(commonRouter.allowedMethods());

app.listen(8080);
