module.exports = function (config) {
  config.set({
    mutate: [
      "src/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "apps/**/*.{ts,tsx}",
      "libs/**/*.{ts,tsx}",
    ],
    mutator: "typescript",
    packageManager: "npm",
    reporters: ["progress", "clear-text", "html"],
    testRunner: "vitest",
    vitest: {
      configFile: "vitest.config.ts",
    },
    tsconfigFile: "tsconfig.json",
    coverageAnalysis: "perTest",
    clearTextReporter: {
      logTests: true,
    },
    htmlReporter: {
      baseDir: "reports/stryker",
    },
    concurrency: 2,
    timeoutMS: 300000,
  });
};
