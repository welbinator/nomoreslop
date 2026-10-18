# WordPress Plugin Quality Checks

This skill sets up automated code quality checks for a WordPress plugin project. It catches coding standard violations, static analysis issues, dependency vulnerabilities, and supply chain risks.

## The Stack

- **PHPCS** - WordPress coding standards enforcement
- **PHPStan** - Static analysis for PHP (type safety, logic errors)
- **Snyk** - Dependency vulnerability scanning
- **Socket** - Supply chain security (detects malicious packages)
- **SonarCloud** or **Codacy** - Cloud-based static analysis and code quality tracking

---

## PHPCS (PHP CodeSniffer)

**What it catches:** Coding standard violations, formatting issues, naming conventions, WordPress-specific best practices.

**GitHub required?** Optional. Can run locally or in CI.

### 🤖 Agent can do this automatically

Install PHPCS and WordPress coding standards:
```bash
composer require --dev squizlabs/php_codesniffer wp-coding-standards/wpcs dealerdirect/phpcodesniffer-composer-installer
```

Create `.phpcs.xml` in the project root:
```xml
<?xml version="1.0"?>
<ruleset name="WordPress Plugin Coding Standards">
    <description>Code quality rules for WordPress plugin</description>

    <!-- Check all PHP files in the plugin -->
    <file>.</file>

    <!-- Exclude vendor and build directories -->
    <exclude-pattern>*/vendor/*</exclude-pattern>
    <exclude-pattern>*/node_modules/*</exclude-pattern>
    <exclude-pattern>*/build/*</exclude-pattern>

    <!-- Use WordPress coding standards -->
    <rule ref="WordPress-Core"/>
    <rule ref="WordPress-Docs"/>
    <rule ref="WordPress-Extra"/>

    <!-- Check for PHP cross-version compatibility -->
    <config name="testVersion" value="7.4-"/>
    <rule ref="PHPCompatibility"/>

    <!-- Show progress and sniff codes -->
    <arg value="ps"/>
    <arg name="colors"/>
    <arg name="extensions" value="php"/>
</ruleset>
```

Add composer script to `composer.json`:
```json
{
  "scripts": {
    "phpcs": "phpcs",
    "phpcbf": "phpcbf"
  }
}
```

Create GitHub Actions workflow `.github/workflows/phpcs.yml`:
```yaml
name: PHPCS

on:
  pull_request:
    paths:
      - '**.php'
  push:
    branches:
      - main
      - develop

jobs:
  phpcs:
    name: PHP CodeSniffer
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          coverage: none

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run PHPCS
        run: composer run phpcs
```

### 👤 Human must do this manually

Nothing. Fully automated.

---

## PHPStan

**What it catches:** Type errors, undefined variables, unreachable code, logic errors, WordPress-specific issues.

**GitHub required?** Optional. Can run locally or in CI.

### 🤖 Agent can do this automatically

Install PHPStan with WordPress extensions:
```bash
composer require --dev phpstan/phpstan szepeviktor/phpstan-wordpress phpstan/extension-installer
```

Create `phpstan.neon` in the project root:
```neon
includes:
    - phar://phpstan.phar/conf/bleedingEdge.neon

parameters:
    level: 8
    paths:
        - .
    excludePaths:
        - vendor
        - node_modules
        - tests
    bootstrapFiles:
        - vendor/autoload.php
    scanDirectories:
        - vendor/wordpress/wordpress
    ignoreErrors:
        # WordPress globals and dynamic calls
        - '#Function apply_filters invoked with#'
        - '#Function do_action invoked with#'
```

Add composer script:
```json
{
  "scripts": {
    "phpstan": "phpstan analyse --memory-limit=512M"
  }
}
```

Create GitHub Actions workflow `.github/workflows/phpstan.yml`:
```yaml
name: PHPStan

on:
  pull_request:
    paths:
      - '**.php'
  push:
    branches:
      - main
      - develop

jobs:
  phpstan:
    name: PHPStan Static Analysis
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          coverage: none

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run PHPStan
        run: composer run phpstan
```

### 👤 Human must do this manually

Nothing. Fully automated.

---

## Snyk

**What it catches:** Known vulnerabilities in composer dependencies, outdated packages with security issues.

**GitHub required?** Required for CI integration. Optional for local CLI use.

### 🤖 Agent can do this automatically

Add Snyk step to CI workflow (see combined workflow below).

### 👤 Human must do this manually

1. Sign up at [snyk.io](https://snyk.io) (free tier available)
2. Generate API token from account settings
3. Add `SNYK_TOKEN` as a GitHub Actions secret in repo settings

---

## Socket

**What it catches:** Supply chain attacks, malicious packages, suspicious npm/composer packages, typosquatting.

**GitHub required?** Yes. Socket operates as a GitHub App that checks PRs.

### 🤖 Agent can do this automatically

Create `socket.yml` in the project root:
```yaml
version: v1
issueRules:
  - type: alert
    name: Block high-risk packages
    description: Blocks packages with high-risk indicators
    level: error
    filters:
      - packageName: "*"
        risk: high
```

Provide installation instructions in PR or README:
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

## SonarCloud (Recommended) or Codacy

**What they catch:** Code smells, bugs, security vulnerabilities, code duplication, test coverage, maintainability issues.

**GitHub required?** Yes for both.

### SonarCloud

### 🤖 Agent can do this automatically

Create `sonar-project.properties`:
```properties
sonar.projectKey=your-org_your-plugin-name
sonar.organization=your-org

# Paths
sonar.sources=.
sonar.exclusions=vendor/**,node_modules/**,tests/**,build/**

# PHP settings
sonar.php.version=7.4
sonar.php.coverage.reportPaths=coverage.xml
```

Add SonarCloud step to CI workflow (see combined workflow below).

### 👤 Human must do this manually

1. Sign up at [sonarcloud.io](https://sonarcloud.io) with GitHub account (free for open source)
2. Import the repository
3. Generate a token from My Account → Security
4. Add `SONAR_TOKEN` as a GitHub Actions secret
5. Update `sonar.projectKey` and `sonar.organization` in `sonar-project.properties`

### Codacy (Alternative)

### 🤖 Agent can do this automatically

Optionally create `.codacy.yml` for custom configuration:
```yaml
---
engines:
  phpcs:
    enabled: true
  phpmd:
    enabled: true

exclude_paths:
  - 'vendor/**'
  - 'node_modules/**'
  - 'tests/**'
```

### 👤 Human must do this manually

1. Sign up at [codacy.com](https://codacy.com) with GitHub account (free for open source)
2. Add the repository through the Codacy dashboard
3. Codacy will automatically start analyzing commits and PRs

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
  phpcs:
    name: PHPCS
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          coverage: none
      
      - name: Install dependencies
        run: composer install --prefer-dist --no-progress
      
      - name: Run PHPCS
        run: composer run phpcs

  phpstan:
    name: PHPStan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          coverage: none
      
      - name: Install dependencies
        run: composer install --prefer-dist --no-progress
      
      - name: Run PHPStan
        run: composer run phpstan

  snyk:
    name: Snyk Security
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Snyk to check for vulnerabilities
        uses: snyk/actions/php@master
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
- **Security architecture issues** - Authenticated encryption decisions, key management patterns
- **Rate limiting defaults** - Is your REST API wide open to abuse?
- **WordPress-specific security patterns** - Nonce validation, capability checks, data sanitization context
- **Performance issues** - N+1 queries, inefficient database calls
- **Accessibility issues** - WCAG compliance, keyboard navigation
- **UX problems** - Confusing settings, poor error messages

**Recommended:** Get a human security review from experts who know WordPress plugin security patterns. Check out [marcindudek.dev](https://marcindudek.dev) for WordPress security audits.

---

*Downloaded from [NoMoreSlop.com](https://nomoreslop.com) — resources for developers who vibe code and care about what they ship.*
