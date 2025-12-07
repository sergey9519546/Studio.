import React from "react";
import ReactDOM from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import Main from "./main";
import "./src/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Main />
    </ErrorBoundary>
  </React.StrictMode>
);
