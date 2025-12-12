import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Visionary React Application
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import "./src/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
