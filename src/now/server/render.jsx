import React from "react";
import { renderToString } from "react-dom/server";
import express from "express";
import { renderStylesToString } from "emotion-server";

import App from "../client/App";

const app = express();

app.get("/", (req, res) => {
  res.send(renderStylesToString(renderToString(<App />)));
});

app.listen(3000);
