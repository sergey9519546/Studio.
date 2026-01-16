// vite.config.ts - Production Optimizations
import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import { resolve } from "path";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],

  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },

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
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/observable/ConnectableObservable.js"
        ),
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
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/testing/TestScheduler.js"
        ),
      },
      {
        find: "rxjs/scheduler/queue",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/queue.js"
        ),
      },
      {
        find: "rxjs/scheduler/VirtualTimeScheduler",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/VirtualTimeScheduler.js"
        ),
      },
      {
        find: "rxjs/scheduler/asap",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/asap.js"
        ),
      },
      {
        find: "rxjs/scheduler/async",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/async.js"
        ),
      },
      {
        find: "rxjs/scheduler/animationFrame",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/animationFrame.js"
        ),
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
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/UnsubscriptionError.js"
        ),
      },
      {
        find: "./util/UnsubscriptionError",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/UnsubscriptionError.js"
        ),
      },
      {
        find: "rxjs/util/ObjectUnsubscribedError",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/ObjectUnsubscribedError.js"
        ),
      },
      {
        find: "./util/ObjectUnsubscribedError",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/ObjectUnsubscribedError.js"
        ),
      },
      {
        find: "rxjs/util/EmptyError",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/EmptyError.js"
        ),
      },
      {
        find: "./util/EmptyError",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/EmptyError.js"
        ),
      },
      {
        find: "rxjs/util/ArgumentOutOfRangeError",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/ArgumentOutOfRangeError.js"
        ),
      },
      {
        find: "./util/ArgumentOutOfRangeError",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/ArgumentOutOfRangeError.js"
        ),
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
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/symbol/iterator.js"
        ),
      },
      {
        find: "./symbol/iterator",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/symbol/iterator.js"
        ),
      },
      {
        find: "rxjs/symbol/observable",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/symbol/observable.js"
        ),
      },
      {
        find: "./symbol/observable",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/symbol/observable.js"
        ),
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
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/pipe.js"
        ),
      },
      {
        find: "./util/pipe",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/util/pipe.js"
        ),
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
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/testing/TestScheduler.js"
        ),
      },
      {
        find: "./observable/ConnectableObservable",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/observable/ConnectableObservable.js"
        ),
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
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/queue.js"
        ),
      },
      {
        find: "./scheduler/VirtualTimeScheduler",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/VirtualTimeScheduler.js"
        ),
      },
      {
        find: "./scheduler/asap",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/asap.js"
        ),
      },
      {
        find: "./scheduler/async",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/async.js"
        ),
      },
      {
        find: "./scheduler/animationFrame",
        replacement: resolve(
          __dirname,
          "node_modules/rxjs/dist/esm/internal/scheduler/animationFrame.js"
        ),
      },
      { find: "@", replacement: "/src" },
      { find: "@app", replacement: "/src" },
    ],
  },
});
