// Files every export must contain before it is packaged or published.
// Pages live under a language prefix ("/" only redirects to one of them);
// tests/unit/git-deploy.test.ts checks this list against src/i18n/routes.ts.
export const REQUIRED_DEPLOY_FILES = [
  "index.html",
  ".htaccess",
  "404.html",
  "es/index.html",
  "es/aviso-legal/index.html",
  "es/privacidad/index.html",
  "es/cookies/index.html",
  "en/index.html",
  "en/legal-notice/index.html",
  "en/privacy/index.html",
  "en/cookies/index.html",
  "robots.txt",
  "sitemap.xml",
];
