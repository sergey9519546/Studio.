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

const adfSchemaBase = resolve(
  __dirname,
  "node_modules/@atlaskit/adf-schema/dist/esm"
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
const resolveAtlaskitIcon = (source: string, importer?: string) => {
  if (!source.startsWith("@atlaskit/icon")) {
    return null;
  }

  const normalizedImporter = importer?.replace(/\\/g, "/") || "";
  if (
    source === "@atlaskit/icon" &&
    normalizedImporter.includes("/@atlaskit/icon-object/dist/esm/artifacts/glyph/")
  ) {
    const candidate = resolve(__dirname, "shims/atlaskit-icon-tile.js");
    if (fs.existsSync(candidate)) {
      return candidate;
    }
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
    const attemptPaths = [
      resolve(iconDist, `${rest}.js`),
      resolveGlyphFallback(`${rest}.js`),
      resolve(iconGlyph, `${rest}.js`),
    ];
    candidate = attemptPaths.find((p) => p && fs.existsSync(p)) || null;
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
const resolveAtlaskitAdfSchema = (source: string) => {
  if (!source.startsWith("@atlaskit/adf-schema")) {
    return null;
  }

  const normalized = source
    .replace("@atlaskit/adf-schema", "")
    .replace(/^\/+/, "");
  if (normalized === "steps") {
    const stepsShimCandidate = resolve(
      __dirname,
      "shims/atlaskit-adf-schema-steps.js"
    );
    if (fs.existsSync(stepsShimCandidate)) {
      return stepsShimCandidate;
    }
  }
  if (!normalized) {
    const shimCandidate = resolve(__dirname, "shims/atlaskit-adf-schema.js");
    if (fs.existsSync(shimCandidate)) {
      return shimCandidate;
    }
  }
  const specialPaths: Record<string, string> = {
    "schema-default": "schema/default-schema.js",
  };
  if (specialPaths[normalized]) {
    const specialCandidate = resolve(adfSchemaBase, specialPaths[normalized]);
    if (fs.existsSync(specialCandidate)) {
      return specialCandidate;
    }
  }
  const baseTarget = normalized || "index.js";
  let candidate = resolve(adfSchemaBase, baseTarget);
  if (candidate && fs.existsSync(candidate)) {
    const stat = fs.statSync(candidate);
    if (stat.isFile()) {
      return candidate;
    }
    if (stat.isDirectory()) {
      const indexFile = resolve(candidate, "index.js");
      if (fs.existsSync(indexFile)) {
        return indexFile;
      }
    }
  }

  if (normalized && !/\.[^\/]+$/.test(normalized)) {
    candidate = resolve(adfSchemaBase, `${normalized}.js`);
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
};

const resolveAtlaskitLinkProviderShim = (
  source: string,
  importer?: string
) => {
  if (source !== "@atlaskit/link-provider" || !importer) {
    return null;
  }

  if (importer.includes("shims/atlaskit-link-provider.js")) {
    return null;
  }

  const candidate = resolve(__dirname, "shims/atlaskit-link-provider.js");
  if (fs.existsSync(candidate)) {
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

const resolveAtlaskitLogoConstantsShim = (
  source: string,
  importer?: string
) => {
  if (source !== "../../constants" || !importer) {
    return null;
  }

  const normalizedImporter = importer.replace(/\\/g, "/");
  if (!normalizedImporter.includes("/@atlaskit/logo/dist/esm/legacy-logos/")) {
    return null;
  }

  const basePath = normalizedImporter.includes("/legacy-logos/")
    ? resolve(__dirname, "shims/atlaskit-logo-legacy-constants.js")
    : resolve(__dirname, "node_modules/@atlaskit/logo/dist/esm/constants.js");
  const candidate = basePath;
  if (fs.existsSync(candidate)) {
    return candidate;
  }

  return null;
};

const resolveAtlaskitProfilecardAnalytics = (
  source: string,
  importer?: string
) => {
  if (source !== "../../util/analytics" || !importer) {
    return null;
  }

  const normalizedImporter = importer.replace(/\\/g, "/");
  if (!normalizedImporter.includes("/@atlaskit/profilecard/dist/esm/components/")) {
    return null;
  }

  const candidate = resolve(__dirname, "shims/profilecard-analytics.js");
  if (fs.existsSync(candidate)) {
    return candidate;
  }

  return null;
};

const resolveAtlaskitMissingLogoIcon = (
  source: string,
  importer?: string
) => {
  if (!source.startsWith("./icon") || !importer) {
    return null;
  }

  const normalizedImporter = importer.replace(/\\/g, "/");
  const match = normalizedImporter.match(
    /@atlaskit\/logo\/dist\/esm\/(?:artifacts\/logo-components|legacy-logos)\/([^/]+)\/index\.js$/
  );
  if (!match) {
    return null;
  }

  const component = match[1];
  const isLegacy = normalizedImporter.includes("/legacy-logos/");
  const baseDir = resolve(
    __dirname,
    isLegacy
      ? "node_modules/@atlaskit/logo/dist/esm/legacy-logos"
      : "node_modules/@atlaskit/logo/dist/esm/artifacts/logo-components"
  );
  const candidate = resolve(baseDir, component, "icon.js");
  if (fs.existsSync(candidate)) {
    return candidate;
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

const resolveAtlaskitIconConstants = (
  source: string,
  importer?: string
) => {
  if (source !== "./constants" || !importer) {
    return null;
  }

  const normalizedImporter = importer.replace(/\\/g, "/");
  if (!normalizedImporter.includes("/@atlaskit/icon/dist/esm/index.js")) {
    return null;
  }

  const candidate = resolve(iconDist, "constants.js");
  if (fs.existsSync(candidate)) {
    return candidate;
  }

  return null;
};

const resolveAtlaskitMediaClientShim = (
  source: string,
  importer?: string
) => {
  if (source !== "@atlaskit/media-client" || !importer) {
    return null;
  }

  const normalizedImporter = importer.replace(/\\/g, "/");
  if (normalizedImporter.includes("/shims/")) {
    return null;
  }
  if (!normalizedImporter.includes("/node_modules/")) {
    return null;
  }

  return resolve(
    __dirname,
    "shims/atlaskit-media-client-get-media-client.js"
  );
};

const resolveAtlaskitBlockInsertMenuLegacy = (
  source: string,
  importer?: string
) => {
  if (
    source !== "./block-insert-menu-legacy" ||
    !importer ||
    !importer.replace(/\\/g, "/").endsWith(
      "/@atlaskit/editor-core/dist/esm/plugins/insert-block/ui/ToolbarInsertBlock/block-insert-menu.js"
    )
  ) {
    return null;
  }

  return resolve(__dirname, "shims/atlaskit-block-insert-menu-legacy.js");
};

const atlaskitIconResolver = () => ({
  name: "atlaskit-icon-resolver",
  enforce: "pre",
  resolveId(source: string, importer?: string) {
    // if (source.includes("media")) {
    //   console.log("Atlaskit resolver sees", source, importer);
    // }
    return (
      resolveAtlaskitAdfSchema(source) ||
      resolveAtlaskitLinkProviderShim(source, importer) ||
      resolveAtlaskitIcon(source, importer) ||
      resolveAtlaskitLogo(source) ||
      resolveAtlaskitIconConstants(source, importer) ||
      resolveAtlaskitMediaInlineImport(source, importer) ||
      resolveAtlaskitBlockInsertMenuLegacy(source, importer) ||
      resolveAtlaskitMediaClientShim(source, importer) ||
      resolveAtlaskitLogoConstantsShim(source, importer) ||
      resolveAtlaskitMissingLogoIcon(source, importer) ||
      resolveAtlaskitProfilecardAnalytics(source, importer) ||
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
          "atlaskit-link": [
            "@atlaskit/link-extractors",
            "@atlaskit/smart-card",
            "@atlaskit/link-provider"
          ],
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
        find: "@atlaskit/editor-common/ui",
        replacement: resolve(__dirname, "shims/atlaskit-editor-common-ui.js"),
      },
      {
        find: "@atlaskit/platform-feature-flags",
        replacement: resolve(
          __dirname,
          "node_modules/@atlaskit/platform-feature-flags/dist/esm/index.js"
        ),
      },
      {
        find: "rxjs/observable/from",
        replacement: "rxjs",
      },
      {
        find: "rxjs/operators/concatMap",
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/operators/map",
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/operators/tap",
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/operators/bufferCount",
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/operators/audit",
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/observable/fromPromise",
        replacement: "rxjs",
      },
      {
        find: /^rxjs\/observable\/.*/,
        replacement: "rxjs",
      },
      {
        find: "rxjs/observable/ConnectableObservable",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/observable/ConnectableObservable.js"),
      },
      {
        find: "rxjs/observable/dom/AjaxObservable",
        replacement: resolve(__dirname, "shims/rxjs-observable-ajax.js"),
      },
      {
        find: /^rxjs\/add\/observable\/.*/,
        replacement: "rxjs",
      },
      {
        find: /^rxjs\/add\/operator\/.*/,
        replacement: "rxjs/operators",
      },
      {
        find: /^rxjs\/operator\/.*/,
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/testing/TestScheduler",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/testing/TestScheduler.js"),
      },
      {
        find: "rxjs/scheduler/queue",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/queue.js"),
      },
      {
        find: "rxjs/scheduler/VirtualTimeScheduler",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/VirtualTimeScheduler.js"),
      },
      {
        find: "rxjs/scheduler/asap",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/asap.js"),
      },
      {
        find: "rxjs/scheduler/async",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/async.js"),
      },
      {
        find: "rxjs/scheduler/animationFrame",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/animationFrame.js"),
      },
      {
        find: "rxjs/operators/buffer",
        replacement: "rxjs/operators",
      },
      {
        find: "./operators/audit",
        replacement: "rxjs/operators",
      },
      {
        find: "./operators/buffer",
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/operators/auditTime",
        replacement: "rxjs/operators",
      },
      {
        find: "./operators/auditTime",
        replacement: "rxjs/operators",
      },
      {
        find: "./operators/bufferCount",
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/operators/bufferTime",
        replacement: "rxjs/operators",
      },
      {
        find: "./operators/bufferTime",
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/operators/bufferToggle",
        replacement: "rxjs/operators",
      },
      {
        find: "./operators/bufferToggle",
        replacement: "rxjs/operators",
      },
      {
        find: /^rxjs\/operators\/.*/,
        replacement: "rxjs/operators",
      },
      {
        find: /^\.\/operators\/.*/,
        replacement: "rxjs/operators",
      },
      {
        find: "rxjs/util/isArray",
        replacement: resolve(__dirname, "shims/rxjs-util-isArray.js"),
      },
      {
        find: "./util/isArray",
        replacement: resolve(__dirname, "shims/rxjs-util-isArray.js"),
      },
      {
        find: "rxjs/util/isObject",
        replacement: resolve(__dirname, "shims/rxjs-util-isObject.js"),
      },
      {
        find: "./util/isObject",
        replacement: resolve(__dirname, "shims/rxjs-util-isObject.js"),
      },
      {
        find: "rxjs/util/isFunction",
        replacement: resolve(__dirname, "shims/rxjs-util-isFunction.js"),
      },
      {
        find: "./util/isFunction",
        replacement: resolve(__dirname, "shims/rxjs-util-isFunction.js"),
      },
      {
        find: "rxjs/util/errorObject",
        replacement: resolve(__dirname, "shims/rxjs-util-errorObject.js"),
      },
      {
        find: "./util/errorObject",
        replacement: resolve(__dirname, "shims/rxjs-util-errorObject.js"),
      },
      {
        find: "rxjs/util/tryCatch",
        replacement: resolve(__dirname, "shims/rxjs-util-tryCatch.js"),
      },
      {
        find: "./util/tryCatch",
        replacement: resolve(__dirname, "shims/rxjs-util-tryCatch.js"),
      },
      {
        find: "rxjs/util/UnsubscriptionError",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/UnsubscriptionError.js"),
      },
      {
        find: "./util/UnsubscriptionError",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/UnsubscriptionError.js"),
      },
      {
        find: "rxjs/util/ObjectUnsubscribedError",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/ObjectUnsubscribedError.js"),
      },
      {
        find: "./util/ObjectUnsubscribedError",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/ObjectUnsubscribedError.js"),
      },
      {
        find: "rxjs/util/EmptyError",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/EmptyError.js"),
      },
      {
        find: "./util/EmptyError",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/EmptyError.js"),
      },
      {
        find: "rxjs/util/ArgumentOutOfRangeError",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/ArgumentOutOfRangeError.js"),
      },
      {
        find: "./util/ArgumentOutOfRangeError",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/ArgumentOutOfRangeError.js"),
      },
      {
        find: "rxjs/util/TimeoutError",
        replacement: resolve(__dirname, "shims/rxjs-util-TimeoutError.js"),
      },
      {
        find: "./util/TimeoutError",
        replacement: resolve(__dirname, "shims/rxjs-util-TimeoutError.js"),
      },
      {
        find: "rxjs/symbol/rxSubscriber",
        replacement: resolve(__dirname, "shims/rxjs-symbol-rxSubscriber.js"),
      },
      {
        find: "./symbol/rxSubscriber",
        replacement: resolve(__dirname, "shims/rxjs-symbol-rxSubscriber.js"),
      },
      {
        find: "rxjs/symbol/iterator",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/symbol/iterator.js"),
      },
      {
        find: "./symbol/iterator",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/symbol/iterator.js"),
      },
      {
        find: "rxjs/symbol/observable",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/symbol/observable.js"),
      },
      {
        find: "./symbol/observable",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/symbol/observable.js"),
      },
      {
        find: "rxjs/util/root",
        replacement: resolve(__dirname, "shims/rxjs-util-root.js"),
      },
      {
        find: "./util/root",
        replacement: resolve(__dirname, "shims/rxjs-util-root.js"),
      },
      {
        find: "rxjs/util/pipe",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/pipe.js"),
      },
      {
        find: "./util/pipe",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/util/pipe.js"),
      },
      {
        find: /^\.\/add\/observable\/.*/,
        replacement: "rxjs",
      },
      {
        find: /^\.\/add\/operator\/.*/,
        replacement: "rxjs/operators",
      },
      {
        find: /^\.\/operator\/.*/,
        replacement: "rxjs/operators",
      },
      {
        find: "./testing/TestScheduler",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/testing/TestScheduler.js"),
      },
      {
        find: "./observable/ConnectableObservable",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/observable/ConnectableObservable.js"),
      },
      {
        find: "./observable/dom/AjaxObservable",
        replacement: resolve(__dirname, "shims/rxjs-observable-ajax.js"),
      },
      {
        find: "rxjs/util/toSubscriber",
        replacement: resolve(__dirname, "shims/rxjs-util-toSubscriber.js"),
      },
      {
        find: "./util/toSubscriber",
        replacement: resolve(__dirname, "shims/rxjs-util-toSubscriber.js"),
      },
      {
        find: "./scheduler/queue",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/queue.js"),
      },
      {
        find: "./scheduler/VirtualTimeScheduler",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/VirtualTimeScheduler.js"),
      },
      {
        find: "./scheduler/asap",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/asap.js"),
      },
      {
        find: "./scheduler/async",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/async.js"),
      },
      {
        find: "./scheduler/animationFrame",
        replacement: resolve(__dirname, "node_modules/rxjs/dist/esm/internal/scheduler/animationFrame.js"),
      },
      { find: "@", replacement: "/src" },
    ],
    dedupe: [
      "@atlaskit/media-client",
      "@atlaskit/tokens",
      "@atlaskit/editor-common",
      "@atlaskit/adf-utils",
      "@atlaskit/adf-schema",
      "@atlaskit/media-ui",
      "@atlaskit/smart-card",
    ],
  },
});
