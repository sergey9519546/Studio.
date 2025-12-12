import {
  BookOpen,
  FileText,
  Grid,
  Layers,
  Layout,
  LucideIcon,
  MessageSquare,
  Users,
} from "lucide-react";

export interface RouteConfig {
  path: string;
  label: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
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
    requiresAuth: true,
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
    requiresAuth: true,
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
    requiresAuth: true,
    description: "Individual project workspace with brief, assets, and tools",
    metadata: {
      title: "Project Dashboard - Studio Roster",
      keywords: ["project", "dashboard", "brief", "assets"],
    },
  },
  {
    path: "/moodboard",
    label: "Visuals",
    icon: Grid,
    requiresAuth: true,
    description: "Visual inspiration and moodboard management",
    metadata: {
      title: "Moodboard - Studio Roster",
      keywords: ["moodboard", "visuals", "inspiration", "assets"],
    },
  },
  {
    path: "/talent",
    label: "Talent",
    icon: Users,
    requiresAuth: true,
    description: "Freelancer roster and talent management",
    metadata: {
      title: "Talent Roster - Studio Roster",
      keywords: ["talent", "freelancers", "roster", "hiring"],
    },
  },
  {
    path: "/writers-room",
    label: "Writer's Room",
    icon: FileText,
    requiresAuth: true,
    description: "AI-powered creative collaboration and chat interface",
    metadata: {
      title: "Writer's Room - Studio Roster",
      keywords: ["writers room", "ai chat", "collaboration", "creative"],
    },
  },
  {
    path: "/knowledge-base",
    label: "Knowledge Base",
    icon: BookOpen,
    requiresAuth: true,
    description: "Documentation and knowledge management system",
    metadata: {
      title: "Knowledge Base - Studio Roster",
      keywords: ["knowledge", "documentation", "confluence", "wiki"],
    },
  },
  {
    path: "/transcripts",
    label: "Transcripts",
    icon: MessageSquare,
    requiresAuth: true,
    description: "Audio and video transcript management",
    metadata: {
      title: "Transcripts - Studio Roster",
      keywords: ["transcripts", "audio", "video", "text"],
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

export const isAuthRequired = (path: string): boolean => {
  const route = getRouteByPath(path);
  return route?.requiresAuth ?? true;
};

export const getRouteDescription = (path: string): string => {
  const route = getRouteByPath(path);
  return route?.description || "";
};

// Navigation helpers
export const getMainNavigationRoutes = (): RouteConfig[] => {
  return routes.filter(route => 
    ["/", "/projects", "/moodboard", "/talent", "/writers-room", "/knowledge-base", "/transcripts"]
      .includes(route.path)
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
