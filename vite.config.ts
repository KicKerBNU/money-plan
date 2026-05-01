/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'

const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url))
const localPreviewHosts = [
  'localhost',
  '127.0.0.1',
  '192.168.1.161',
  '192.168.2.1',
  'macbook-pro-2',
  'MacBook-Pro-2',
  'macbook-pro-2.local',
  'MacBook-Pro-2.local',
  '.local',
  '192.168.1.161.sslip.io',
  '192.168.2.1.sslip.io',
  '.sslip.io',
]

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: localPreviewHosts,
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: localPreviewHosts,
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ],
  },
})