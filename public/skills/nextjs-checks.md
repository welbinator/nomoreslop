# Next.js Quality Checks

This skill sets up automated code quality checks for a Next.js project. It catches linting errors, dependency vulnerabilities, supply chain risks, and code quality issues.

## The Stack

- **ESLint** (built into Next.js) - JavaScript/TypeScript linting with Next.js-specific rules
- **TypeScript strict mode** - Enhanced type safety
- **Snyk** - Dependency vulnerability scanning
- **Socket** - Supply chain security (detects malicious packages)
- **SonarCloud** or **DeepSource** - Cloud-based static analysis and code quality tracking

---

## ESLint (Built-in)

**What it catches:** Code style issues, common bugs, Next.js-specific anti-patterns (like using `<img>` instead of `<Image>`), React hooks violations.

**GitHub required?** Optional. Can run locally or in CI.

### 🤖 Agent can do this automatically

Next.js ships with ESLint pre-configured. If the project was created with `create-next-app`, the `lint` script already exists.

Verify `package.json` has:
```json
{
  "scripts": {
    "lint": "next lint"
  }
}
```

If it doesn't exist, add it. Then install ESLint:
```bash
npm install --save-dev eslint eslint-config-next
```

Create or update `.eslintrc.json`:
```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@next/next/no-html-link-for-pages": "error",
    "@next/next/no-img-element": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "prefer-const": "error",
    "no-unused-vars": "error"
  }
}
```

For stricter linting, update `next.config.js` to fail builds on lint errors:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Fail build on lint warnings and errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Fail build on TypeScript errors
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
```

Create GitHub Actions workflow `.github/workflows/eslint.yml`:
```yaml
name: ESLint

on:
  pull_request:
    paths:
      - '**.js'
      - '**.ts'
      - '**.jsx'
      - '**.tsx'
  push:
    branches:
      - main
      - develop

jobs:
  eslint:
    name: Next.js ESLint
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

Check if `tsconfig.json` exists. If it does, ensure strict mode is enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Add type-check script to `package.json`:
```json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

Add type checking to CI (see combined workflow below).

### 👤 Human must do this manually

Nothing. Fully automated.

---

## Snyk

**What it catches:** Known vulnerabilities in npm dependencies, outdated packages with security issues, Next.js-specific vulnerabilities.

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
  - ".next/**"
  - "out/**"
  - "build/**"
```

### 👤 Human must do this manually

1. Go to [socket.dev](https://socket.dev)
2. Click "Install GitHub App"
3. Authorize Socket for the repository
4. Socket will automatically start scanning PRs

---

## SonarCloud (Recommended) or DeepSource

**What they catch:** Code smells, bugs, security vulnerabilities, code duplication, test coverage, maintainability issues.

**GitHub required?** Yes for both.

### SonarCloud

### 🤖 Agent can do this automatically

Create `sonar-project.properties`:
```properties
sonar.projectKey=your-org_your-nextjs-app
sonar.organization=your-org

# Paths
sonar.sources=app,src,pages,components,lib
sonar.tests=__tests__,**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx
sonar.exclusions=node_modules/**,.next/**,out/**,public/**,*.config.js,*.config.ts

# JavaScript/TypeScript settings
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Test coverage
sonar.coverage.exclusions=**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/*.stories.tsx
```

Add SonarCloud step to CI workflow (see combined workflow below).

### 👤 Human must do this manually

1. Sign up at [sonarcloud.io](https://sonarcloud.io) with GitHub account (free for open source)
2. Import the repository
3. Generate a token from My Account → Security
4. Add `SONAR_TOKEN` as a GitHub Actions secret
5. Update `sonar.projectKey` and `sonar.organization` in `sonar-project.properties`

### DeepSource (Alternative)

### 🤖 Agent can do this automatically

Create `.deepsource.toml`:
```toml
version = 1

[[analyzers]]
name = "javascript"
enabled = true

  [analyzers.meta]
  plugins = ["react"]
  environment = ["nodejs", "browser"]
  
  [analyzers.exclude_patterns]
  paths = [
    "node_modules/**",
    ".next/**",
    "out/**",
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
    name: ESLint & TypeScript
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
      
      - name: TypeScript type check
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
    name: Next.js Build
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
      
      - name: Build Next.js app
        run: npm run build
        env:
          NODE_ENV: production

  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Shallow clones disabled for better analysis
      
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
      
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## What This Stack Still Misses

Even with all these tools running, they won't catch:

- **Server Component vs Client Component mistakes** - Are you using `useState` in a Server Component?
- **Data fetching patterns** - Are you over-fetching? Using the wrong caching strategy?
- **Route handler security** - Missing rate limiting, inadequate auth checks
- **Environment variable leaks** - `NEXT_PUBLIC_` prefix exposes vars to the client
- **Image optimization misuse** - Serving oversized images, missing `priority` on LCP images
- **Performance issues** - Large client-side bundles, too much JavaScript shipped to browser
- **Accessibility issues** - Missing alt text, poor keyboard navigation, color contrast
- **SEO problems** - Missing metadata, broken OpenGraph tags, poor Core Web Vitals
- **API route vulnerabilities** - CSRF, SQL injection in raw queries, missing input validation

**Next.js-specific gotchas to watch:**
- Using `<img>` instead of `<Image>` (ESLint catches this if configured)
- Client-side env vars leaking sensitive data
- Not using `loading="lazy"` or `priority` correctly on images
- Forgetting `revalidate` in `fetch()` calls (stale data forever)
- Blocking the server with heavy compute (move to API routes or background jobs)

**Recommended:** Review your app with the Next.js production checklist and run Lighthouse audits. Automated tools won't catch UX and performance issues.

---

*Downloaded from [NoMoreSlop.com](https://nomoreslop.com) — resources for developers who vibe code and care about what they ship.*
