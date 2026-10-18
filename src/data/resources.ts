export interface Resource {
  name: string;
  url: string;
  description: string;
  category: 'Agent Readiness & Compatibility' | 'AI Coding Tools' | 'Learning & Communities' | 'Security & Code Quality' | 'News & Newsletters' | 'Web Dev';
  free: boolean;
}

export const resources: Resource[] = [
  // Web Dev
  {
    name: "Why Does My Site Suck?",
    url: "https://whydoesmysitesuck.com",
    description: "Instant audit of your website's performance, accessibility, SEO, and best practices. Straight answers, no fluff.",
    category: "Web Dev",
    free: true
  },

  // Agent Readiness & Compatibility
  {
    name: "Is It Agent Ready?",
    url: "https://isitagentready.com",
    description: "Cloudflare's tool that scores your website on AI agent compatibility — MCP support, structured data, robots.txt, and more.",
    category: "Agent Readiness & Compatibility",
    free: true
  },
  {
    name: "Cloudflare AI Gateway",
    url: "https://developers.cloudflare.com/ai-gateway/",
    description: "Route, cache, and observe AI API traffic. Useful for understanding what agents are actually calling in your apps.",
    category: "Agent Readiness & Compatibility",
    free: true
  },
  
  // AI Coding Tools
  {
    name: "Cursor",
    url: "https://cursor.com",
    description: "The most popular AI-first code editor. Tab completion that actually understands your codebase.",
    category: "AI Coding Tools",
    free: false
  },
  {
    name: "Claude Code",
    url: "https://claude.ai/code",
    description: "Anthropic's agentic coding tool. Runs in your terminal and can read, write, and execute code autonomously.",
    category: "AI Coding Tools",
    free: false
  },
  {
    name: "GitHub Copilot",
    url: "https://github.com/features/copilot",
    description: "Microsoft/OpenAI's AI pair programmer. Integrated directly into VS Code and other editors.",
    category: "AI Coding Tools",
    free: false
  },
  {
    name: "Windsurf",
    url: "https://windsurf.com",
    description: "AI code editor from Codeium. Cascade agent can work across multiple files autonomously.",
    category: "AI Coding Tools",
    free: false
  },
  {
    name: "OpenClaw",
    url: "https://openclaw.ai",
    description: "Personal AI assistant platform. Run AI agents locally with access to your tools, files, and services.",
    category: "AI Coding Tools",
    free: true
  },
  
  // Learning & Communities
  { name: "skills.sh", url: "https://skills.sh", description: "The open agent skills ecosystem. Browse a leaderboard of community-built agent skills and install any with a single npx command.", category: "Learning & Communities", free: true },
  { name: "Impeccable Chrome Extension", url: "https://chromewebstore.google.com/detail/impeccable/bdkgmiklpdmaojlpflclinlofgjfpabf", description: "Visual overlay that highlights AI design anti-patterns directly on any website. See exactly what's wrong and where, without screenshots or guesswork.", category: "Security & Code Quality", free: true },
  {
    url: "https://clawhub.ai",
    description: "Community-built library of agent skills — configuration files that teach AI assistants domain-specific knowledge.",
    category: "Learning & Communities",
    free: true
  },
  {
    name: "Latent Space",
    url: "https://www.latent.space",
    description: "Podcast and newsletter for AI engineers. Some of the best technical deep-dives on how these tools actually work.",
    category: "Learning & Communities",
    free: true
  },
  {
    name: "r/vibecoding",
    url: "https://reddit.com/r/vibecoding",
    description: "Community for developers building with AI assistance. Real talk about what works and what breaks.",
    category: "Learning & Communities",
    free: true
  },
  
  // Security & Code Quality
  {
    name: "OWASP Top 10",
    url: "https://owasp.org/www-project-top-ten/",
    description: "The definitive list of the most critical web application security risks. Required reading before shipping anything to production.",
    category: "Security & Code Quality",
    free: true
  },
  {
    name: "Have I Been Pwned",
    url: "https://haveibeenpwned.com",
    description: "Check if your email or domain has appeared in a data breach. Also useful for understanding real-world breach patterns.",
    category: "Security & Code Quality",
    free: true
  },
  {
    name: "Semgrep",
    url: "https://semgrep.dev",
    description: "Fast, lightweight static analysis that finds bugs and security issues. Write custom rules for your own patterns.",
    category: "Security & Code Quality",
    free: true
  },
  
  // News & Newsletters
  {
    name: "The Pragmatic Engineer",
    url: "https://newsletter.pragmaticengineer.com",
    description: "Gergely Orosz's newsletter on software engineering and the business of tech. Consistently the most credible voice in the space.",
    category: "News & Newsletters",
    free: false
  },
  {
    name: "TLDR Tech",
    url: "https://tldr.tech",
    description: "Daily digest of the most interesting stories in tech, AI, and developer tools. Five minutes a day.",
    category: "News & Newsletters",
    free: true
  },
  {
    name: "AI News by Import AI",
    url: "https://importai.substack.com",
    description: "Jack Clark's weekly newsletter. Dense, technical, and covers AI safety and capabilities honestly.",
    category: "News & Newsletters",
    free: true
  }
];
