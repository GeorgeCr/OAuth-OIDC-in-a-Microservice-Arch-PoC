const express = require("express");
const {
  createProxyMiddleware,
  responseInterceptor,
} = require("http-proxy-middleware");
const morgan = require("morgan");
const fetch = require("cross-fetch");

const ROUTES = [
  {
    url: "/product",
    proxy: {
      logger: console,
      target: "http://authentication-service:9000",
      changeOrigin: true,
      pathRewrite: {
        "^/product": "/authenticate",
      },
      selfHandleResponse: true,
      onProxyReq: (proxyReq, req, res) => {
      },
      onProxyRes: responseInterceptor(
        async (responseBuffer, proxyRes, req, res) => {
          try {
            const isAuthenticated = proxyRes.statusCode === 200 || false;
            if (!isAuthenticated) {
              return JSON.stringify({
                isAuthenticated,
              });
            }
            // call authz service
            const scope = req.headers["x-scope"];
            let accessToken;
            if (req.headers["authorization"]) {
              accessToken = req.headers["authorization"].split("Bearer")[1];
            }
            const authzResult = await fetch(
              "http://authorization-service:8000/authorize",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-scope": scope,
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );
            const isAuthorized = authzResult.status === 200 || false;
            if (!isAuthorized) {
              res.statusCode = authzResult.status;
              res.statusMessage = "Unauthorized";
              return JSON.stringify({
                isAuthenticated,
                isAuthorized,
              });
            }
            // all good, proceed to access product data
            const productName = req.headers["x-product-name"];
            const productPrice = req.headers["x-product-price"];
            const productResult = await fetch(
              "http://product-service:4000/product",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-product-price": productPrice,
                  "x-product-name": productName,
                },
                body: JSON.stringify(req.body),
              }
            );
            // const data = await productResult.json();

            return JSON.stringify({
              created: true,
            });
          } catch (err) {
            console.log(err, "oh no");
          }
        }
      ),
    },
  },
];

const app = express();

app.use(morgan("combined"));

app.get("/health", (req, res) => {
  res.send("All good proxy");
});

ROUTES.forEach((route) => {
  app.use(route.url, createProxyMiddleware(route.proxy));
});

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(6000);
