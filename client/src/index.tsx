import React from "react";
import "./index.css";
import App from "./App";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <App basename={import.meta.env.BASE_URL ?? ""} />
  </React.StrictMode>,
);
