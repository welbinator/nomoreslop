# Universal Quality Checks

This skill sets up baseline code quality checks that work across ANY tech stack — WordPress, Node.js, Python, Go, Rust, whatever. Use this as your foundation, then add stack-specific tools on top.

## The Stack

- **Dependency scanner** (Snyk recommended)
- **Static analyzer** (SonarCloud for multi-language support)
- **Pre-commit hooks** (Husky + lint-staged)
- **Git hygiene** (`.gitignore` verification)
- **Secret scanning** (GitHub's built-in scanner)
- **Automated dependency updates** (Dependabot)

---

## Dependency Scanner: Snyk

**What it catches:** Known vulnerabilities in dependencies, outdated packages with security issues, license compliance violations.

**GitHub required?** Required for CI integration. Optional for local CLI use.

**Supports:** npm, yarn, pnpm, pip, composer, maven, gradle, go modules, cargo, and more.

### 🤖 Agent can do this automatically

For GitHub Actions, add Snyk to your CI workflow:

```yaml
# .github/workflows/security.yml
name: Security Checks

on:
  pull_request:
  push:
    branches:
      - main
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  snyk:
    name: Snyk Vulnerability Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/node@master  # Change to python, php, etc.
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --fail-on=upgradable
```

For local CLI scanning, add to your package manager scripts or Makefile.

### 👤 Human must do this manually

1. Sign up at [snyk.io](https://snyk.io) (free tier available)
2. Generate API token from account settings
3. Add `SNYK_TOKEN` as a GitHub Actions secret in repo settings
4. Import the repository through Snyk dashboard for continuous monitoring

---

## Static Analyzer: SonarCloud

**What it catches:** Code smells, bugs, security vulnerabilities, code duplication, test coverage gaps, maintainability issues.

**GitHub required?** Yes. SonarCloud integrates with GitHub PRs.

**Supports:** JavaScript, TypeScript, Python, Java, C#, PHP, Go, Kotlin, Ruby, Scala, and more.

### 🤖 Agent can do this automatically

Create `sonar-project.properties`:
```properties
sonar.projectKey=your-org_your-project
sonar.organization=your-org

# General paths (adjust for your stack)
sonar.sources=src,lib,app
sonar.tests=test,tests,__tests__
sonar.exclusions=**/node_modules/**,**/vendor/**,**/dist/**,**/build/**

# For code coverage (if you have tests)
# Adjust path based on your test runner output
sonar.coverage.exclusions=**/*.test.*,**/*.spec.*
```

Add SonarCloud to GitHub Actions:
```yaml
# .github/workflows/quality.yml
name: Code Quality

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Shallow clones disabled for better analysis
      
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### 👤 Human must do this manually

1. Sign up at [sonarcloud.io](https://sonarcloud.io) with GitHub account (free for open source)
2. Import the repository
3. Generate a token from My Account → Security
4. Add `SONAR_TOKEN` as a GitHub Actions secret
5. Update `sonar.projectKey` and `sonar.organization` in `sonar-project.properties`

---

## Pre-commit Hooks: Husky + lint-staged

**What it catches:** Prevents committing broken code, ensures linting/formatting runs before commit.

**GitHub required?** No. Pure local git hooks.

**Supports:** Any linter or formatter (ESLint, Prettier, Black, gofmt, rustfmt, PHPCS, etc.)

### 🤖 Agent can do this automatically

Install Husky and lint-staged:
```bash
npm install --save-dev husky lint-staged
```

Initialize Husky:
```bash
npx husky init
```

Create `.husky/pre-commit`:
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

Add to `package.json`:
```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"],
    "*.php": ["composer run phpcs"],
    "*.py": ["black", "flake8"]
  }
}
```

Adjust the `lint-staged` config based on the project's stack.

### 👤 Human must do this manually

Nothing. Fully automated. Hooks install when dependencies are installed.

---

## Git Hygiene: .gitignore

**What it catches:** Prevents accidentally committing secrets, build artifacts, or dependencies to version control.

**GitHub required?** No. Pure local git configuration.

### 🤖 Agent can do this automatically

Verify or create `.gitignore` with common patterns:
```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.production

# Dependencies
node_modules/
vendor/
__pycache__/
*.pyc

# Build outputs
dist/
build/
out/
.next/
.astro/

# IDE / Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/
.nyc_output/

# Secrets
*.pem
*.key
secrets.json
```

Run a check to ensure `.env` files aren't tracked:
```bash
git ls-files | grep -E '\.env$|\.env\.'
```

If any are found, remove them:
```bash
git rm --cached .env
git commit -m "Remove accidentally committed .env file"
```

### 👤 Human must do this manually

Review the output of the `.env` check. If sensitive data was committed, consider rotating secrets.

---

## Secret Scanning: GitHub Secret Scanner

**What it catches:** API keys, tokens, passwords, private keys accidentally committed to the repository.

**GitHub required?** Yes. Built into GitHub (free).

### 🤖 Agent can do this automatically

Optionally create `.github/secret_scanning.yml` to exclude test fixtures:
```yaml
paths-ignore:
  - 'tests/fixtures/**'
  - 'test/fixtures/**'
  - '__tests__/fixtures/**'
  - 'docs/examples/**'
```

Provide instructions in README or PR:
```markdown
## Enable Secret Scanning

**Human action needed:**
1. Go to repo Settings → Security → Code security and analysis
2. Enable "Secret scanning"
3. Enable "Push protection" to block secrets from being pushed
```

### 👤 Human must do this manually

1. Go to GitHub repo → Settings → Security → Code security and analysis
2. Enable "Secret scanning"
3. Enable "Push protection" (blocks pushes with secrets)
4. Review any detected secrets and rotate them

---

## Automated Dependency Updates: Dependabot

**What it catches:** Keeps dependencies up to date automatically, creates PRs for security updates.

**GitHub required?** Yes. Built into GitHub (free).

### 🤖 Agent can do this automatically

Create `.github/dependabot.yml`:
```yaml
version: 2
updates:
  # For npm / yarn / pnpm projects
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    groups:
      dev-dependencies:
        dependency-type: "development"
      production-dependencies:
        dependency-type: "production"
  
  # For composer (PHP) projects
  - package-ecosystem: "composer"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
  
  # For pip (Python) projects
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
  
  # For GitHub Actions workflows
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "monthly"
```

Remove the sections that don't apply to your project. Dependabot will automatically detect which package managers you're using.

### 👤 Human must do this manually

1. Merge the `.github/dependabot.yml` file
2. Wait for Dependabot to create its first PRs (may take a few minutes)
3. Review and merge Dependabot PRs regularly

Optional: Go to repo Settings → Security → Code security and analysis → Dependabot version updates → Enable to configure from UI.

---

## Combined Baseline Workflow

### 🤖 Agent can do this automatically

Create `.github/workflows/baseline-security.yml`:
```yaml
name: Baseline Security & Quality

on:
  pull_request:
  push:
    branches:
      - main
      - develop
  schedule:
    - cron: '0 0 * * 0'  # Weekly scan

jobs:
  snyk:
    name: Snyk Dependency Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Adjust this based on your stack
      - name: Setup runtime (Node.js example)
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci  # Or: composer install, pip install -r requirements.txt, etc.
      
      - name: Run Snyk security scan
        uses: snyk/actions/node@master  # Change to python, php, maven, etc.
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  sonarcloud:
    name: SonarCloud Analysis
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Shallow clones disabled
      
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  
  gitignore-check:
    name: Verify .gitignore
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check for committed .env files
        run: |
          if git ls-files | grep -E '\.env$|\.env\.'; then
            echo "ERROR: .env files are committed! Add them to .gitignore."
            exit 1
          fi
          echo "✅ No .env files committed"
```

---

## What No Automated Tool Catches

Even with this full baseline stack, you still need human review for:

- **Business logic bugs** - Does the code actually solve the right problem?
- **Architecture decisions** - Is this the right approach? Are you over-engineering?
- **Security design flaws** - Authentication flow issues, authorization logic errors
- **Performance issues** - Inefficient algorithms, database query patterns, memory leaks
- **User experience problems** - Confusing UI, poor error messages, accessibility gaps
- **API design mistakes** - Inconsistent naming, breaking changes, poor documentation
- **Data privacy violations** - GDPR, CCPA compliance, proper data handling
- **Rate limiting gaps** - Are your endpoints protected from abuse?
- **Input validation** - Are you sanitizing user input? Using parameterized queries?
- **Error handling** - Are you exposing stack traces? Logging sensitive data?

**Automated tools find the obvious stuff. Humans find the subtle stuff.**

For deeper security reviews, check out [nomoreslop.com/reviews](https://nomoreslop.com/reviews) for curated lists of security auditors who actually understand code.

---

## Stack-Specific Additions

This universal baseline is your foundation. Add these on top:

- **WordPress plugins:** PHPCS, PHPStan → See `wordpress-plugin-checks.md`
- **Node.js projects:** ESLint, TypeScript → See `nodejs-checks.md`
- **Next.js apps:** Built-in ESLint, Image optimization checks → See `nextjs-checks.md`
- **Astro sites:** ESLint with Astro plugin, env var leak checks → See `astro-checks.md`

---

*Downloaded from [NoMoreSlop.com](https://nomoreslop.com) — resources for developers who vibe code and care about what they ship.*
