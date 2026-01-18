import {
  Grid,
  Layers,
  Layout,
  LucideIcon,
  Sparkles,
  Users
} from "lucide-react";

export interface RouteConfig {
  path: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  metadata?: {
    title?: string;
    keywords?: string[];
  };
}

export const routes: RouteConfig[] = [
  {
    path: "/",
    label: "Dashboard",
    icon: Layout,
    description: "Main dashboard with project overview and quick actions",
    metadata: {
      title: "Dashboard - Studio Roster",
      keywords: ["dashboard", "overview", "projects"],
    },
  },
  {
    path: "/projects",
    label: "Projects",
    icon: Layers,
    description: "Project management hub with creation and listing",
    metadata: {
      title: "Projects - Studio Roster",
      keywords: ["projects", "management", "client"],
    },
  },
  {
    path: "/projects/:id",
    label: "Project Dashboard",
    icon: Layers,
    description: "Individual project workspace with brief, assets, and tools",
    metadata: {
      title: "Project Dashboard - Studio Roster",
      keywords: ["project", "dashboard", "brief", "assets"],
    },
  },
  {
    path: "/moodboard",
    label: "Moodboard",
    icon: Grid,
    description: "Visual inspiration and moodboard management",
    metadata: {
      title: "Moodboard - Studio Roster",
      keywords: ["moodboard", "visuals", "inspiration", "assets"],
    },
  },
  {
    path: "/freelancers",
    label: "Freelancers",
    icon: Users,
    description: "Freelancer roster and talent management",
    metadata: {
      title: "Freelancers - Studio Roster",
      keywords: ["freelancers", "roster", "hiring", "talent"],
    },
  },
  {
    path: "/writers-room",
    label: "Writers Room",
    icon: Sparkles,
    description: "Lumina-powered creative collaboration and chat interface",
    metadata: {
      title: "Writers Room - Studio Roster",
      keywords: [
        "writers room",
        "lumina",
        "firebase ai",
        "gemini",
        "ai chat",
        "collaboration",
        "creative",
      ],
    },
  },
  {
    path: "/editor",
    label: "Future Editor",
    icon: Sparkles,
    description: "Experimental Apple x CapCut Editor Interface",
    metadata: {
      title: "Future Editor - Studio Roster",
      keywords: ["editor", "future", "experimental", "video"],
    },
  },
];

// Helper functions for route management
export const getRouteByPath = (path: string): RouteConfig | undefined => {
  // Handle dynamic routes like /projects/:id
  const dynamicRoutes = ["/projects/:id"];

  if (dynamicRoutes.some(dynamic => {
    const pattern = dynamic.replace(/:[^/]+/g, '[^/]+');
    return new RegExp(`^${pattern}$`).test(path);
  })) {
    return routes.find(route => route.path === "/projects/:id");
  }

  return routes.find(route => route.path === path);
};

export const getRouteLabel = (path: string): string => {
  const route = getRouteByPath(path);
  return route?.label || "Unknown";
};

export const getRouteIcon = (path: string) => {
  const route = getRouteByPath(path);
  return route?.icon || Layout;
};

export const getRouteDescription = (path: string): string => {
  const route = getRouteByPath(path);
  return route?.description || "";
};

// Navigation helpers
export const getMainNavigationRoutes = (): RouteConfig[] => {
  return routes.filter((route) =>
    [
      "/",
      "/projects",
      "/moodboard",
      "/freelancers",
      "/writers-room",
    ].includes(route.path)
  );
};

export const getBreadcrumbRoutes = (currentPath: string): RouteConfig[] => {
  const breadcrumbs: RouteConfig[] = [];
  const pathSegments = currentPath.split("/").filter(Boolean);

  // Always start with Dashboard
  if (pathSegments.length === 0) {
    return [getRouteByPath("/")!];
  }

  // Add dashboard
  breadcrumbs.push(getRouteByPath("/")!);

  // Add current route if it's not dashboard
  const currentRoute = getRouteByPath(currentPath);
  if (currentRoute && currentPath !== "/") {
    breadcrumbs.push(currentRoute);
  }

  return breadcrumbs;
};

// Project-specific route helpers
export const isProjectRoute = (path: string): boolean => {
  return path.startsWith("/projects");
};

export const getProjectId = (path: string): string | null => {
  const match = path.match(/^\/projects\/([^/]+)$/);
  return match ? match[1] : null;
};

// Default redirect route
export const DEFAULT_REDIRECT = "/";

// Route validation
export const isValidRoute = (path: string): boolean => {
  if (path === "/") return true;

  return routes.some(route => {
    if (route.path === path) return true;

    // Handle dynamic routes
    if (route.path.includes(":")) {
      const pattern = route.path.replace(/:[^/]+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(path);
    }

    return false;
  });
};
