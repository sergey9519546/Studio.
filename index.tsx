import ReactDOM from "react-dom/client";
import App from "./src/App.tsx"; // Production-ready Studio Roster with Router
import { Providers } from "./src/app/providers";
import "./src/index.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <Providers>
    <App />
  </Providers>
);
