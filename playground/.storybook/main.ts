/* eslint-disable import-x/no-nodejs-modules */

import type { InlineConfig } from "vite"
import { defineMain } from "@storybook/react-vite/node"
import dotenv from "dotenv"
import { mergeConfig } from "vite"
import { resolve } from "path"
import tokenGenerator from "../../src/plugins/tokenGenerator.ts"
import tsconfigPaths from "vite-tsconfig-paths"
import { writeFile } from "fs/promises"

const config = defineMain({
    stories: [
        "../**/*.stories.@(ts|tsx)",
    ],
    addons: [
        "@storybook/addon-vitest",
        "@storybook/addon-designs",
        "@storybook/addon-a11y",
        "@chromatic-com/storybook",
        ...(process.env.npm_lifecycle_event === "dev:storybook"
            ? [import.meta.resolve("./localPreset.ts")]
            : [
                "@candyspace/react-meta-framework/addons/state",
                "@candyspace/react-meta-framework/addons/breakpoints",
            ]
        ),
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {
            strictMode: true,
        },
    },
    core: {
        builder: "@storybook/builder-vite",
        disableTelemetry: true,
        disableWhatsNewNotifications: true,
        enableCrashReports: false,
    },
    viteFinal: (config) => {
        dotenv.config()
        return mergeConfig(config, {
            plugins: [
                tsconfigPaths(),
                tokenGenerator(
                    writeFile,
                    resolve(import.meta.dirname, "../assets/scss.ts"),
                    resolve(import.meta.dirname, "../assets/scss/tokens"),
                ),
            ],
            optimizeDeps: {
                exclude: ["ast-types", "fs", "fs/promises"],
                include: ["react", "react-dom", "classnames", "tabbable"],
            },
            define: {
                "process.env": process.env,
            },
        } satisfies InlineConfig)
    },
})

export default config
