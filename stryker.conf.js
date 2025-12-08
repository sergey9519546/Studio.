export default function (config) {
  config.set({
    mutate: [
      "src/**/*.{ts,tsx}",
      "components/**/*.{ts,tsx}",
      "apps/**/*.{ts,tsx}",
      "libs/**/*.{ts,tsx}",
    ],
    mutator: "typescript",
    packageManager: "npm",
    reporters: ["progress", "html"],
    testRunner: "vitest",
    vitest: {
      configFile: "vitest.config.ts",
    },
    tsconfigFile: "tsconfig.json",
    coverageAnalysis: "perTest",
    htmlReporter: {
      baseDir: "reports/stryker",
    },
    concurrency: 2,
    timeoutMS: 300000,
  });
};
