import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getBreadcrumbRoutes,
  getProjectId,
  getRouteByPath,
  isProjectRoute,
  RouteConfig
} from "../routes";

interface RouteContextType {
  currentRoute: RouteConfig | undefined;
  breadcrumbs: RouteConfig[];
  isProjectRoute: boolean;
  projectId: string | null;
  setBreadcrumbs: (breadcrumbs: RouteConfig[]) => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

interface RouteProviderProps {
  children: React.ReactNode;
}

export const RouteProvider: React.FC<RouteProviderProps> = ({ children }) => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<RouteConfig[]>([]);

  // Get current route based on path
  const currentRoute = getRouteByPath(location.pathname);

  // Check if current route is a project route
  const isProjectRouteFlag = isProjectRoute(location.pathname);

  // Extract project ID if this is a project route
  const projectId = getProjectId(location.pathname);

  // Update breadcrumbs when location changes
  useEffect(() => {
    const newBreadcrumbs = getBreadcrumbRoutes(location.pathname);
    setBreadcrumbs(newBreadcrumbs);
  }, [location.pathname]);

  const contextValue: RouteContextType = {
    currentRoute,
    breadcrumbs,
    isProjectRoute: isProjectRouteFlag,
    projectId,
    setBreadcrumbs,
  };

  return (
    <RouteContext.Provider value={contextValue}>
      {children}
    </RouteContext.Provider>
  );
};

// Custom hook to use route context
export const useRoute = (): RouteContextType => {
  const context = useContext(RouteContext);
  if (context === undefined) {
    throw new Error("useRoute must be used within a RouteProvider");
  }
  return context;
};

// Custom hook to get current route metadata
export const useRouteMetadata = () => {
  const { currentRoute } = useRoute();

  return {
    title: currentRoute?.metadata?.title || "Studio Roster",
    description: currentRoute?.description || "",
    keywords: currentRoute?.metadata?.keywords || [],
  };
};

// Custom hook to check if current route matches a given path or pattern
export const useRouteMatch = (path: string): boolean => {
  const location = useLocation();
  return location.pathname === path;
};

// Custom hook to check if current route is in a specific section
export const useRouteSection = (section: string): boolean => {
  const location = useLocation();
  return location.pathname.startsWith(`/${section}`);
};

// Custom hook to get navigation state for sidebar
export const useNavigationState = () => {
  const location = useLocation();
  const { breadcrumbs } = useRoute();

  // Get the active navigation item based on current path
  const getActiveNavigationItem = () => {
    if (location.pathname === "/") return "dashboard";
    if (location.pathname.startsWith("/projects") && !location.pathname.includes("/", 1)) return "projects";
    if (location.pathname.startsWith("/projects/") && location.pathname.split("/").length > 2) return "projects";
    if (location.pathname.startsWith("/moodboard")) return "moodboard";
    if (location.pathname.startsWith("/freelancers")) return "freelancers";
    if (location.pathname.startsWith("/writers-room")) return "writers-room";
    return "dashboard";
  };

  return {
    activeItem: getActiveNavigationItem(),
    breadcrumbs,
    isRoot: location.pathname === "/",
  };
};

export default RouteContext;
