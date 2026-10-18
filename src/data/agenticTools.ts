export interface AgenticTool {
  name: string;
  url: string;
  description: string;
  category: 'CMS & Content' | 'Notes & Knowledge' | 'Dev Tools' | 'APIs & Integrations';
  sourceUrl?: string;   // GitHub or docs link
  free: boolean;
  openSource: boolean;
}

export const agenticTools: AgenticTool[] = [
  {
    name: "EmDash",
    url: "https://github.com/emdash-cms/emdash",
    description: "A full-stack serverless JavaScript CMS built on Astro 6. Described as the spiritual successor to WordPress — plugins run in sandboxed Cloudflare Worker isolates, built with AI agents from the ground up.",
    category: "CMS & Content",
    sourceUrl: "https://github.com/emdash-cms/emdash",
    free: true,
    openSource: true
  },
  {
    name: "Parchment",
    url: "https://theparchment.app",
    description: "A self-hosted Notion replacement with a clean API. Built for developers who want structured notes and pages that agents can read and write to programmatically.",
    category: "Notes & Knowledge",
    free: true,
    openSource: false
  },
  {
    name: "OpenClaw",
    url: "https://openclaw.ai",
    description: "Personal AI assistant platform with a skill system. Agents run locally with access to your files, tools, calendar, and messaging. ClawHub-compatible.",
    category: "Dev Tools",
    free: true,
    openSource: false
  }
];
