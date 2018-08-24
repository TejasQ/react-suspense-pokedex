// @ts-ignore
import React, { unstable_AsyncMode as AsyncMode } from "react";
// @ts-ignore
import { render, unstable_createRoot } from "react-dom";

import App from "./client/App";

const root = unstable_createRoot(document.getElementById("root"));

root.render(<App />);
