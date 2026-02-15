// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const boundaries = require("eslint-plugin-boundaries");

module.exports = defineConfig([
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  },

  // ─── Hexagonal Architecture Boundaries ───
  {
    files: ["src/app/**/*.ts"],
    plugins: {
      boundaries,
    },
    settings: {
      "boundaries/dependency-nodes": ["import"],
      "boundaries/elements": [
        // ── Core layers ──
        {
          type: "core-domain",
          pattern: "src/app/core/domain/**",
          mode: "full",
        },
        {
          type: "core-application",
          pattern: "src/app/core/application/**",
          mode: "full",
        },
        {
          type: "core-infrastructure",
          pattern: "src/app/core/infrastructure/**",
          mode: "full",
        },

        // ── Feature layers (capture featureName) ──
        {
          type: "feature-domain",
          pattern: "src/app/features/*/domain/**",
          capture: ["featureName"],
          mode: "full",
        },
        {
          type: "feature-application",
          pattern: "src/app/features/*/application/**",
          capture: ["featureName"],
          mode: "full",
        },
        {
          type: "feature-infrastructure",
          pattern: "src/app/features/*/infrastructure/**",
          capture: ["featureName"],
          mode: "full",
        },
        {
          type: "feature-presentation",
          pattern: "src/app/features/*/presentation/**",
          capture: ["featureName"],
          mode: "full",
        },
        {
          type: "feature-routes",
          pattern: "src/app/features/*/*.routes.ts",
          capture: ["featureName"],
          mode: "full",
        },

        // ── App root (app.ts, app.config.ts, app.routes.ts, main.ts) ──
        {
          type: "app-root",
          pattern: "src/app/*",
          mode: "full",
        },
      ],
    },
    rules: {
      "boundaries/element-types": [
        "error",
        {
          default: "disallow",
          rules: [
            // ── Core layers ──
            {
              from: "core-domain",
              allow: ["core-domain"],
            },
            {
              from: "core-application",
              allow: ["core-domain", "core-application"],
            },
            {
              from: "core-infrastructure",
              allow: ["core-domain", "core-application", "core-infrastructure"],
            },

            // ── Feature domain: only itself + core-domain ──
            {
              from: "feature-domain",
              allow: [
                ["feature-domain", { featureName: "${from.featureName}" }],
                "core-domain",
              ],
            },

            // ── Feature application: domain + core (domain, application) ──
            {
              from: "feature-application",
              allow: [
                ["feature-application", { featureName: "${from.featureName}" }],
                ["feature-domain", { featureName: "${from.featureName}" }],
                "core-domain",
                "core-application",
              ],
            },

            // ── Feature infrastructure: domain + application + core ──
            {
              from: "feature-infrastructure",
              allow: [
                ["feature-infrastructure", { featureName: "${from.featureName}" }],
                ["feature-domain", { featureName: "${from.featureName}" }],
                ["feature-application", { featureName: "${from.featureName}" }],
                "core-domain",
                "core-application",
                "core-infrastructure",
              ],
            },

            // ── Feature presentation: application + domain (types only enforced by review) + core ──
            {
              from: "feature-presentation",
              allow: [
                ["feature-presentation", { featureName: "${from.featureName}" }],
                ["feature-application", { featureName: "${from.featureName}" }],
                ["feature-domain", { featureName: "${from.featureName}" }],
                "core-domain",
                "core-application",
              ],
            },

            // ── Feature routes: all layers of the same feature ──
            {
              from: "feature-routes",
              allow: [
                ["feature-presentation", { featureName: "${from.featureName}" }],
                ["feature-application", { featureName: "${from.featureName}" }],
                ["feature-domain", { featureName: "${from.featureName}" }],
                ["feature-infrastructure", { featureName: "${from.featureName}" }],
                "core-domain",
                "core-application",
                "core-infrastructure",
              ],
            },

            // ── App root: can import anything ──
            {
              from: "app-root",
              allow: [
                "core-domain",
                "core-application",
                "core-infrastructure",
                "feature-routes",
                "feature-presentation",
                "feature-application",
                "feature-domain",
                "feature-infrastructure",
              ],
            },
          ],
        },
      ],

      "boundaries/external": [
        "error",
        {
          default: "allow",
          rules: [
            // Domain layers must NOT import Angular or RxJS
            {
              from: ["core-domain", "feature-domain"],
              disallow: ["@angular/*", "rxjs", "rxjs/*"],
            },
            // Application layers: only @angular/core allowed (for inject, DI tokens)
            {
              from: ["core-application", "feature-application"],
              disallow: [
                "@angular/common",
                "@angular/common/*",
                "@angular/router",
                "@angular/router/*",
                "@angular/forms",
                "@angular/forms/*",
                "@angular/platform-browser",
                "@angular/platform-browser/*",
                "rxjs",
                "rxjs/*",
              ],
            },
          ],
        },
      ],
    },
  },
]);
