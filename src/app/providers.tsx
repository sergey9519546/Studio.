import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "../components/loading/ErrorBoundary";
import { RouteProvider } from "../context/RouteContext";
import { ToastProvider } from "../context/ToastContext";

// Main Providers Component
interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <ToastProvider>
            <RouteProvider>{children}</RouteProvider>
          </ToastProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

export default Providers;
