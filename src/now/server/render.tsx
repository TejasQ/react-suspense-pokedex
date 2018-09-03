import express from "express";
import React, { Fragment } from "react";
import { renderToNodeStream } from "react-dom/server";

import App from "../client/App";

import { readFileSync } from "fs";
import { join } from "path";

const app = express();

const BaseStyles = () => <style>{readFileSync(join(__dirname, "../../../public/index.css"), "utf8")}</style>;

app.get("/", (_, res) => {
  renderToNodeStream(
    <Fragment>
      <BaseStyles />
      <App />
    </Fragment>,
  ).pipe(res);
});

// tslint:disable
app.listen(3001, () => console.log("Now server listening on port 3001"));
