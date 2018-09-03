import express from "express";
import React, { Fragment } from "react";
import { renderToNodeStream } from "react-dom/server";

import { readFileSync } from "fs";
import { join } from "path";
import App from "../client/App";

const app = express();

app.get("/:pokemon?", (req, res) => {
  renderToNodeStream(
    <Fragment>
      <style>{readFileSync(join(__dirname, "../../../public/index.css"), "utf8")}</style>
      <App pokemon={req.params.pokemon} />
    </Fragment>,
  ).pipe(res);
});

// tslint:disable
app.listen(4001, () => console.log("Future server listening on port 4001"));
