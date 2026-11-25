import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    reporters: process.env.GITHUB_ACTIONS
      ? ["default", "github-actions"]
      : ["default"],

    coverage: {
      provider: "v8", // or 'istanbul'
      include: ["src/**/*.ts"],
      exclude: ["src/server.ts"],
      reporter: ["text", "html"],
      thresholds: {
        "src/services/**": {
          lines: 80,
        },
      },
    },
  },
});
