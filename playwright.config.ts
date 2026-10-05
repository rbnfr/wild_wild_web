import { defineConfig, devices } from '@playwright/test'

const PORT = 3100
const baseURL = `http://127.0.0.1:${PORT}`
const isCI = Boolean(process.env.CI)

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    locale: 'es-ES',
    timezoneId: 'Europe/Madrid',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // Se prueba el build de producción: es lo que se despliega, y es donde se aplican CSP y HSTS.
    command: `npm run build && npx next start --hostname 127.0.0.1 --port ${PORT}`,
    url: baseURL,
    reuseExistingServer: !isCI,
    timeout: 240_000,
    env: {
      NEXT_PUBLIC_SITE_URL: baseURL,
      ALLOW_INDEXING: 'true',
      CONTACT_DELIVERY_MODE: 'dry-run',
      CONTACT_RATE_LIMIT_MAX: '200',
      TRUSTED_PROXY_HOPS: '1',
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: '',
      TURNSTILE_SECRET_KEY: '',
    },
  },
})
