// vite.config.ts - Production Optimizations
import react from "@vitejs/plugin-react";
import fs from "fs";
import { resolve } from "path";
import { defineConfig } from "vite";

const iconBase = resolve(__dirname, "node_modules/@atlaskit/icon");
const iconDist = resolve(iconBase, "dist/esm");
const iconCore = resolve(iconBase, "core");
const iconGlyph = resolve(iconBase, "glyph");
const logoComponentsPath = resolve(
  __dirname,
  "node_modules/@atlaskit/logo/dist/esm/artifacts/logo-components"
);

const glyphFileCache = new Map<string, string | null>();

const searchGlyphFile = (dir: string, target: string): string | null => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = resolve(dir, entry.name);
    if (entry.isFile() && entry.name === target) {
      return fullPath;
    }
    if (entry.isDirectory()) {
      const found = searchGlyphFile(fullPath, target);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

const resolveGlyphFallback = (target: string) => {
  const direct = resolve(iconGlyph, target);
  if (fs.existsSync(direct)) {
    return direct;
  }
  if (glyphFileCache.has(target)) {
    return glyphFileCache.get(target);
  }
  const found = searchGlyphFile(iconGlyph, target);
  glyphFileCache.set(target, found);
  return found;
};
const resolveAtlaskitIcon = (source: string) => {
  if (!source.startsWith("@atlaskit/icon")) {
    return null;
  }

  const normalized = source.replace("@atlaskit/icon", "").replace(/^\/+/, "");
  let candidate: string | null = null;

  if (!normalized || normalized === "utility") {
    candidate = resolve(iconDist, "index.js");
  } else if (normalized.startsWith("utility/migration/")) {
    const rest = normalized.replace("utility/migration/", "");
    const attemptPaths = [
      resolve(iconCore, "migration", `${rest}.js`),
      resolve(iconGlyph, "migration", `${rest}.js`),
    ];
    candidate = attemptPaths.find((p) => p && fs.existsSync(p)) || null;
  } else if (normalized.startsWith("utility/")) {
    const rest = normalized.replace("utility/", "");
    const attemptPaths = [
      resolve(iconDist, `${rest}.js`),
      resolveGlyphFallback(`${rest}.js`),
      resolve(iconCore, `${rest}.js`),
    ];
    candidate = attemptPaths.find((p) => p && fs.existsSync(p)) || null;
  } else if (normalized.startsWith("core/")) {
    const rest = normalized.replace("core/", "");
    const attemptPaths = [
      resolve(iconCore, `${rest}.js`),
      resolveGlyphFallback(`${rest}.js`),
    ];
    candidate = attemptPaths.find((p) => p && fs.existsSync(p)) || null;
  } else if (normalized.startsWith("glyph/")) {
    const rest = normalized.replace("glyph/", "");
    candidate = resolve(iconGlyph, `${rest}.js`);
  } else if (normalized.startsWith("dist/esm/")) {
    const rest = normalized.replace("dist/esm/", "");
    candidate = resolve(iconDist, `${rest}.js`);
  } else {
    const attemptPaths = [
      resolve(iconDist, `${normalized}.js`),
      resolveGlyphFallback(`${normalized}.js`),
      resolve(iconCore, `${normalized}.js`),
    ];
    candidate = attemptPaths.find((p) => p && fs.existsSync(p)) || null;
  }

  if (candidate && fs.existsSync(candidate)) {
    return candidate;
  }

  return null;
};

const resolveAtlaskitLogo = (source: string) => {
  const prefix = "@atlaskit/logo/dist/esm/artifacts/logo-components/";
  if (source.startsWith(prefix)) {
    const after = source.replace(prefix, "");
    if (after.endsWith("/icon")) {
      const component = after.replace("/icon", "");
      const resolved = resolve(logoComponentsPath, component, "logo.js");
      if (fs.existsSync(resolved)) {
        return resolved;
      }
    }
  }
  return null;
};

const resolveCommonLogoIcon = (source: string, importer?: string) => {
  if (!importer || !source.startsWith("./")) {
    return null;
  }

  const importerDir = resolve(importer, "..");
  const baseTarget = source.replace("./", "");
  const variants = new Set<string>([baseTarget]);
  if (baseTarget === "icon") {
    variants.add("logo");
  } else if (baseTarget === "logo") {
    variants.add("icon");
  }
  variants.add("logo-cs");

  const candidatePaths: string[] = [];
  for (const variant of variants) {
    candidatePaths.push(resolve(importerDir, `${variant}.js`));
    candidatePaths.push(resolve(importerDir, `${variant}.jsx`));
  }

  const existing = candidatePaths.find((p) => fs.existsSync(p));
  if (existing) {
    return existing;
  }

  return null;
};

const resolveLegacyCustomIcon = (source: string, importer?: string) => {
  if (!source.startsWith("./ui/") || !importer) {
    return null;
  }

  if (!importer.includes("legacy-custom-icons/dist/esm/index.js")) {
    return null;
  }

  return resolve(__dirname, "shims/legacy-custom-icon-fallback.js");
};

const resolveAtlaskitMediaInlineImport = (
  source: string,
  importer?: string
) => {
  if (!importer) {
    return null;
  }

  const mediaImports = new Set(["./media", "./media.js"]);
  if (!mediaImports.has(source)) {
    return null;
  }

  // console.log("Atlaskit media resolver check", source, importer);

  const normalizedImporter = importer.replace(/\\/g, "/");
  if (
    !normalizedImporter.endsWith(
      "/@atlaskit/editor-core/node_modules/@atlaskit/adf-schema/dist/esm/schema/nodes/media-inline.js"
    )
  ) {
    return null;
  }

  return resolve(
    __dirname,
    "node_modules/@atlaskit/adf-schema/dist/esm/schema/nodes/media.js"
  );
};

const atlaskitIconResolver = () => ({
  name: "atlaskit-icon-resolver",
  resolveId(source: string, importer?: string) {
    // if (source.includes("media")) {
    //   console.log("Atlaskit resolver sees", source, importer);
    // }
    return (
      resolveAtlaskitIcon(source) ||
      resolveAtlaskitLogo(source) ||
      resolveAtlaskitMediaInlineImport(source, importer) ||
      resolveCommonLogoIcon(source, importer) ||
      resolveLegacyCustomIcon(source, importer)
    );
  },
});

export default defineConfig({
  plugins: [react(), atlaskitIconResolver()],

  build: {
    // Production optimizations
    target: "es2015",
    outDir: "build/client",
    emptyOutDir: false, // Prevent file locking issues on Windows
    sourcemap: false,
    minify: "esbuild", // Use esbuild for faster, more reliable minification

    // Code splitting for better caching and CLS prevention
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["lucide-react"],
          "query-vendor": ["@tanstack/react-query"],
        },
        // Optimize chunk loading
        inlineDynamicImports: false,
      },
    },

    // Chunk size warnings
    chunkSizeWarningLimit: 1000,

    // CSS code splitting
    cssCodeSplit: true,
  },

  server: {
    port: 5173,
    proxy: {
      // Proxy API v1 requests to backend
      "/api/v1": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
      // Legacy fallback for non-versioned API calls (if any remain)
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },

  // Resolve options
  resolve: {
    alias: [
      {
        find: "@atlaskit/editor-core/node_modules/@atlaskit/adf-schema/dist/esm/schema/inline-nodes",
        replacement: "/shims/atlaskit-inline-nodes.js",
      },
      {
        // eslint-disable-next-line no-useless-escape
        find: /@atlaskit[\/\\]editor-core[\/\\]node_modules[\/\\]@atlaskit[\/\\]adf-schema[\/\\]dist[\/\\]esm[\/\\]schema[\/\\]nodes[\/\\]media\.js$/,
        replacement: resolve(
          __dirname,
          "node_modules/@atlaskit/adf-schema/dist/esm/schema/nodes/media.js"
        ),
      },
      { find: "@", replacement: "/src" },
    ],
    dedupe: [
      "@atlaskit/media-client",
      "@atlaskit/tokens",
      "@atlaskit/editor-common",
      "@atlaskit/adf-utils",
      "@atlaskit/media-ui",
      "@atlaskit/icon",
      "@atlaskit/icon-object",
      "@atlaskit/smart-card",
    ],
  },
});
