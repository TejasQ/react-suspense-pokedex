import React from "react";
import { renderToString } from "react-dom/server";
import koa from "koa";

import App from "../client/App";

const app = koa();

koa.use("/", (req, res) => {
  res.send(renderToString(<App />));
});

koa.listen(3000);
