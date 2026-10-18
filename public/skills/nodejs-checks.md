# Node.js Quality Checks

This skill sets up automated code quality checks for a Node.js project. It catches linting errors, dependency vulnerabilities, supply chain risks, and code quality issues.

## The Stack

- **ESLint** - JavaScript/TypeScript linting and code style enforcement
- **Snyk** - Dependency vulnerability scanning
- **Socket** - Supply chain security (detects malicious packages)
- **SonarCloud** or **DeepSource** - Cloud-based static analysis and code quality tracking

---

## ESLint

**What it catches:** Code style issues, common bugs, anti-patterns, unused variables, syntax errors.

**GitHub required?** Optional. Can run locally or in CI.

### 🤖 Agent can do this automatically

Install ESLint:
```bash
npm install --save-dev eslint @eslint/js
```

For TypeScript projects, also install:
```bash
npm install --save-dev typescript-eslint
```

Create `eslint.config.js` (flat config format):
```javascript
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
    ],
  },
];
```

For TypeScript projects, use:
```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
    ],
  }
);
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
      - '**.jsx'
      - '**.tsx'
  push:
    branches:
      - main
      - develop

jobs:
  eslint:
    name: ESLint
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

## Snyk

**What it catches:** Known vulnerabilities in npm dependencies, outdated packages with security issues, license compliance issues.

**GitHub required?** Required for CI integration. Optional for local CLI use.

### 🤖 Agent can do this automatically

Add Snyk step to CI workflow (see combined workflow below).

Optionally create `.snyk` for ignoring false positives:
```yaml
# Snyk (https://snyk.io) policy file
version: v1.25.0
ignore: {}
patch: {}
```

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
  - "build/**"
```

Provide installation instructions:
```markdown
## Socket Setup Required

This project uses Socket for supply chain security.

**Human action needed:**
1. Install the Socket GitHub App: https://socket.dev
2. Authorize the app for this repository
3. Socket will automatically scan all PRs for supply chain risks
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
sonar.projectKey=your-org_your-project-name
sonar.organization=your-org

# Paths
sonar.sources=src
sonar.tests=test,tests,__tests__
sonar.exclusions=node_modules/**,dist/**,build/**,coverage/**

# JavaScript/TypeScript settings
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Test coverage
sonar.coverage.exclusions=**/*.test.js,**/*.spec.js,**/*.test.ts,**/*.spec.ts
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
  environment = ["nodejs"]
  
  # Skip vendored files
  [analyzers.exclude_patterns]
  paths = [
    "node_modules/**",
    "dist/**",
    "build/**",
    "coverage/**"
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
  eslint:
    name: ESLint
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

- **Business logic errors** - Does the code actually do what it's supposed to?
- **Runtime-only issues** - Race conditions, memory leaks, async bugs
- **API design flaws** - Inconsistent endpoint naming, poor error responses
- **Performance issues** - Inefficient algorithms, memory bloat, slow queries
- **Security architecture** - JWT secret management, rate limiting, CORS misconfiguration
- **Accessibility issues** - If you're building UIs, these tools won't check WCAG compliance
- **User experience problems** - Confusing error messages, poor state management

**Recommended:** Combine automated checks with code reviews from experienced developers. Tools catch the obvious stuff; humans catch the subtle stuff.

---

*Downloaded from [NoMoreSlop.com](https://nomoreslop.com) — resources for developers who vibe code and care about what they ship.*
