# Astro Quality Checks

This skill sets up automated code quality checks for an Astro project. It catches linting errors, dependency vulnerabilities, supply chain risks, and code quality issues.

## The Stack

- **ESLint** with Astro plugin - JavaScript/TypeScript linting with Astro-specific rules
- **TypeScript strict mode** - Enhanced type safety
- **Snyk** - Dependency vulnerability scanning
- **Socket** - Supply chain security (detects malicious packages)
- **DeepSource** or **SonarCloud** - Cloud-based static analysis and code quality tracking

---

## ESLint with Astro Plugin

**What it catches:** Code style issues, common bugs, Astro-specific anti-patterns, accessibility issues in components.

**GitHub required?** Optional. Can run locally or in CI.

### 🤖 Agent can do this automatically

Install ESLint with Astro support:
```bash
npm install --save-dev eslint eslint-plugin-astro @typescript-eslint/parser typescript-eslint
```

Create `eslint.config.js` (flat config format):
```javascript
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    rules: {
      // General
      'no-unused-vars': 'off', // TypeScript handles this
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Astro-specific
      'astro/no-conflict-set-directives': 'error',
      'astro/no-unused-define-vars-in-style': 'error',
      'astro/no-set-html-directive': 'warn',
      'astro/semi': ['error', 'always'],
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      '.astro/**',
    ],
  },
  {
    files: ['**/*.astro'],
    parser: 'astro-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      extraFileExtensions: ['.astro'],
    },
  },
];
```

Add npm script to `package.json`:
```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

Create GitHub Actions workflow `.github/workflows/eslint.yml`:
```yaml
name: ESLint

on:
  pull_request:
    paths:
      - '**.js'
      - '**.ts'
      - '**.astro'
  push:
    branches:
      - main
      - develop

jobs:
  eslint:
    name: Astro ESLint
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint
```

### 👤 Human must do this manually

Nothing. Fully automated.

---

## TypeScript Strict Mode

**What it catches:** Type errors, null/undefined issues, implicit any types, missing return types.

**GitHub required?** No. Pure local type checking.

### 🤖 Agent can do this automatically

Check if `tsconfig.json` exists. Astro projects should use Astro's strict config:

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", ".astro"]
}
```

Add type-check script to `package.json`:
```json
{
  "scripts": {
    "type-check": "astro check"
  }
}
```

The `astro check` command runs TypeScript checking AND Astro-specific checks (like prop validation).

Add type checking to CI (see combined workflow below).

### 👤 Human must do this manually

Nothing. Fully automated.

---

## Snyk

**What it catches:** Known vulnerabilities in npm dependencies, outdated packages with security issues.

**GitHub required?** Required for CI integration. Optional for local CLI use.

### 🤖 Agent can do this automatically

Add Snyk step to CI workflow (see combined workflow below).

### 👤 Human must do this manually

1. Sign up at [snyk.io](https://snyk.io) (free tier available)
2. Generate API token from account settings
3. Add `SNYK_TOKEN` as a GitHub Actions secret in repo settings

---

## Socket

**What it catches:** Supply chain attacks, malicious npm packages, typosquatting, install scripts that run arbitrary code.

**GitHub required?** Yes. Socket operates as a GitHub App that checks PRs.

### 🤖 Agent can do this automatically

Create `socket.yml` in the project root:
```yaml
version: v1
issueRules:
  - type: alert
    name: Block high-risk packages
    description: Blocks packages with install scripts or known malicious indicators
    level: error
    filters:
      - packageName: "*"
        risk: high
      
  - type: alert
    name: Warn on medium risk
    description: Review packages with medium risk indicators
    level: warning
    filters:
      - packageName: "*"
        risk: medium

projectIgnorePaths:
  - "node_modules/**"
  - "dist/**"
  - ".astro/**"
```

### 👤 Human must do this manually

1. Go to [socket.dev](https://socket.dev)
2. Click "Install GitHub App"
3. Authorize Socket for the repository
4. Socket will automatically start scanning PRs

---

## DeepSource (Recommended) or SonarCloud

**What they catch:** Code smells, bugs, security vulnerabilities, code duplication, test coverage, maintainability issues.

**GitHub required?** Yes for both.

### DeepSource (Recommended for Astro)

### 🤖 Agent can do this automatically

Create `.deepsource.toml`:
```toml
version = 1

[[analyzers]]
name = "javascript"
enabled = true

  [analyzers.meta]
  plugins = []
  environment = ["nodejs", "browser"]
  
  [analyzers.exclude_patterns]
  paths = [
    "node_modules/**",
    "dist/**",
    ".astro/**",
    "public/**"
  ]

[[analyzers]]
name = "test-coverage"
enabled = true

[[transformers]]
name = "prettier"
enabled = true
```

### 👤 Human must do this manually

1. Sign up at [deepsource.io](https://deepsource.io) with GitHub account (free for open source)
2. Add the repository through the DeepSource dashboard
3. Activate the repository
4. DeepSource will automatically start analyzing commits and PRs

### SonarCloud (Alternative)

### 🤖 Agent can do this automatically

Create `sonar-project.properties`:
```properties
sonar.projectKey=your-org_your-astro-project
sonar.organization=your-org

# Paths
sonar.sources=src
sonar.tests=src/**/*.test.ts,src/**/*.spec.ts
sonar.exclusions=node_modules/**,dist/**,.astro/**,public/**

# JavaScript/TypeScript settings
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Test coverage
sonar.coverage.exclusions=**/*.test.ts,**/*.spec.ts
```

Add SonarCloud step to CI workflow (see combined workflow below).

### 👤 Human must do this manually

1. Sign up at [sonarcloud.io](https://sonarcloud.io) with GitHub account (free for open source)
2. Import the repository
3. Generate a token from My Account → Security
4. Add `SONAR_TOKEN` as a GitHub Actions secret
5. Update `sonar.projectKey` and `sonar.organization` in `sonar-project.properties`

---

## Combined GitHub Actions Workflow

### 🤖 Agent can do this automatically

Create `.github/workflows/quality.yml`:
```yaml
name: Code Quality

on:
  pull_request:
  push:
    branches:
      - main
      - develop

jobs:
  lint-and-type-check:
    name: ESLint & Astro Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint
      
      - name: Astro type check
        run: npm run type-check

  snyk:
    name: Snyk Security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  build:
    name: Astro Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Astro site
        run: npm run build
        env:
          NODE_ENV: production

  deepsource:
    name: DeepSource
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Required for DeepSource
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests with coverage
        run: npm test -- --coverage
        continue-on-error: true
      
      - name: Report to DeepSource
        run: |
          curl https://deepsource.io/cli | sh
          ./bin/deepsource report --analyzer test-coverage --key javascript --value-file ./coverage/lcov.info
        env:
          DEEPSOURCE_DSN: ${{ secrets.DEEPSOURCE_DSN }}
```

---

## Astro-Specific Security Considerations

Astro has some unique characteristics that automated scanners won't catch:

### Environment Variables

**The `PUBLIC_` prefix exposes variables to the client.**

```astro
---
// ❌ BAD - This leaks to the client-side bundle
const apiKey = import.meta.env.PUBLIC_API_KEY;

// ✅ GOOD - Server-only, never sent to client
const apiKey = import.meta.env.API_KEY;
---
```

### 🤖 Agent can do this automatically

Add a check to `.gitignore` to prevent committing `.env` files:
```
.env
.env.*
!.env.example
```

Create `.env.example` with placeholders:
```bash
# Server-only (not sent to client)
API_KEY=your_api_key_here

# Public (sent to client - use carefully!)
PUBLIC_SITE_URL=https://example.com
```

### 👤 Human must do this manually

Review all `PUBLIC_` environment variables to ensure they don't contain secrets.

---

## API Routes & Server Endpoints

**Astro API routes run on the server but need manual security.**

```typescript
// src/pages/api/data.ts
import type { APIRoute } from 'astro';

// ❌ BAD - No rate limiting, no auth
export const GET: APIRoute = async () => {
  const data = await db.query('SELECT * FROM users');
  return new Response(JSON.stringify(data));
};

// ✅ BETTER - Add auth, rate limiting, input validation
export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Rate limiting logic here
  // Input validation here
  
  const data = await db.query('SELECT * FROM users WHERE public = true');
  return new Response(JSON.stringify(data));
};
```

Automated tools won't catch missing auth or rate limiting.

---

## What This Stack Still Misses

Even with all these tools running, they won't catch:

- **Environment variable leaks** - `PUBLIC_` prefix sends vars to client
- **Server endpoint security** - Missing auth, rate limiting, CORS misconfiguration
- **API route vulnerabilities** - SQL injection, missing input validation
- **Client-side hydration mistakes** - Over-hydrating static content
- **Performance issues** - Shipping too much JavaScript, large images, blocking resources
- **Accessibility issues** - Missing alt text, poor keyboard navigation, color contrast
- **SEO problems** - Missing metadata, broken OpenGraph tags
- **Content Security Policy** - Missing CSP headers, inline script risks
- **Build-time data fetching errors** - Failed API calls during build (silent failures)

**Astro-specific gotchas:**
- Using `client:load` everywhere (kills performance)
- Forgetting to use `<Image>` component for optimization
- Exposing secrets via `PUBLIC_` env vars
- Not setting proper `Cache-Control` headers on API routes
- Missing error boundaries in islands

**Recommended:** Run Lighthouse audits, check your Network tab for leaked data, and manually review all API routes for security.

---

*Downloaded from [NoMoreSlop.com](https://nomoreslop.com) — resources for developers who vibe code and care about what they ship.*
