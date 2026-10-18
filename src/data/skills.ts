export interface Skill {
  slug: string;           // UNIQUE: format "{source}-{id}" e.g. "clawhub-wordpress-pro" or "manual-security-auditor"
  name: string;
  description: string;
  tags: string[];
  category: string;       // e.g. "WordPress", "Node.js", "Security", "General"
  source: 'clawhub' | 'github' | 'manual';
  sourceUrl: string;      // link to skill page
  downloadUrl?: string;   // direct download if available
  prevents?: string[];    // what problems it helps prevent
  featured: boolean;
  addedAt: string;        // ISO date string
}

export const skills: Skill[] = [
  {
    slug: "skills-sh-impeccable",
    name: "impeccable",
    category: "Frontend Design",
    tags: ["frontend", "design", "css", "ui", "anti-patterns", "linting"],
    description: "18 commands that teach your AI real design principles and steer it away from predictable AI design mistakes — purple gradients, overused fonts, nested cards, low contrast, and more.",
    prevents: ["generic AI aesthetics", "purple gradients", "overused fonts", "low contrast", "nested card patterns", "AI color palettes"],
    sourceUrl: "https://impeccable.style",
    downloadUrl: "https://impeccable.style",
    source: "github",
    featured: false,
    addedAt: "2026-04-23",
  },
  {
    name: "frontend-design",
    category: "Frontend Design",
    tags: ["frontend", "design", "css", "ui", "components"],
    description: "Create distinctive, production-grade frontend interfaces with high design quality. Generates creative, polished code that avoids generic AI aesthetics.",
    prevents: ["generic AI aesthetics", "cookie-cutter layouts", "overused font families", "predictable component patterns"],
    sourceUrl: "https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md",
    downloadUrl: "https://raw.githubusercontent.com/anthropics/claude-code/main/plugins/frontend-design/skills/frontend-design/SKILL.md",
    source: "github",
    featured: false,
    addedAt: "2026-04-22",
  },
  {
    slug: "clawhub-astro-advanced",
    name: "astro-advanced",
    category: "Astro",
    tags: ["astro", "javascript", "typescript", "ssr", "ssg", "performance", "islands"],
    description: "Production-grade guidance for Astro projects — scaffolding, rendering modes (SSG/SSR/Hybrid), islands architecture, SEO, caching, and deployment.",
    prevents: ["wrong rendering strategy", "missing adapter configuration", "hydration mistakes", "poor performance defaults"],
    sourceUrl: "https://clawhub.ai/encryptshawn/astro-advanced",
    source: "clawhub",
    featured: false,
    addedAt: "2026-04-22",
  },
  {
    name: "wordpress-pro",
    category: "WordPress",
    tags: ["wordpress", "php", "security", "phpcs"],
    description: "WordPress coding standards, security patterns, PHPCS compliance.",
    prevents: ["common WordPress security anti-patterns"],
    sourceUrl: "https://clawhub.ai/skills/wordpress-pro",
    source: "clawhub",
    featured: true,
    addedAt: "2026-04-21"
  },
  {
    slug: "clawhub-wordpress-plugin-dev",
    name: "wordpress-plugin-dev",
    category: "WordPress",
    tags: ["wordpress", "php", "plugins", "security", "encryption", "rate-limiting"],
    description: "Full plugin development patterns including rate limiting, encryption, SSRF prevention, and GitHub updater with integrity verification.",
    prevents: ["rate limiting off by default", "unauthenticated encryption", "SSRF", "insecure update mechanism"],
    sourceUrl: "https://clawhub.ai/skills/wordpress-plugin-dev",
    source: "clawhub",
    featured: true,
    addedAt: "2026-04-21"
  },
  {
    slug: "clawhub-github",
    name: "github",
    category: "General",
    tags: ["github", "ci", "releases", "workflows"],
    description: "GitHub CLI operations for PRs, CI, and releases.",
    prevents: ["broken release workflows", "skipped CI checks"],
    sourceUrl: "https://clawhub.ai/skills/github",
    source: "clawhub",
    featured: false,
    addedAt: "2026-04-21"
  },
  {
    slug: "clawhub-nodejs-best-practices",
    name: "nodejs-best-practices",
    category: "Node.js",
    tags: ["nodejs", "javascript", "security", "architecture"],
    description: "Node.js architecture, async patterns, security.",
    prevents: ["common Node.js pitfalls", "insecure defaults"],
    sourceUrl: "https://clawhub.ai/skills/nodejs-best-practices",
    source: "clawhub",
    featured: false,
    addedAt: "2026-04-21"
  },
  {
    slug: "clawhub-nodejs-backend-patterns",
    name: "nodejs-backend-patterns",
    category: "Node.js",
    tags: ["nodejs", "express", "fastify", "api", "auth", "middleware"],
    description: "Express/Fastify production patterns, middleware, auth, DB integration.",
    prevents: ["missing auth middleware", "insecure API design"],
    sourceUrl: "https://clawhub.ai/skills/nodejs-backend-patterns",
    source: "clawhub",
    featured: false,
    addedAt: "2026-04-21"
  },
  {
    slug: "clawhub-security-auditor",
    name: "security-auditor",
    category: "Security",
    tags: ["security", "owasp", "auth", "secrets"],
    description: "Code review for OWASP Top 10, auth flows, secrets handling.",
    prevents: ["OWASP Top 10 vulnerabilities"],
    sourceUrl: "https://clawhub.ai/skills/security-auditor",
    source: "clawhub",
    featured: false,
    addedAt: "2026-04-21"
  }
];
