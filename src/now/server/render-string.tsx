import { renderStylesToString } from "emotion-server";
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";

import App from "../client/App";

const app = express();

app.get("/", (_, res) => {
  res.send(
    "<style>html, body{padding:0;margin:0;}*{box-sizing:border-box}</style>" +
      renderStylesToString(renderToString(<App />)),
  );
});

// tslint:disable
app.listen(3002, () => console.log("Server listening in port 3002"));
