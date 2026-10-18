# Skills Search System - Implementation Notes

## Overview

Real-time skills search system that combines local directory with live ClawHub API results.

## Architecture

### Data Layer
- **`src/data/skills.ts`** - TypeScript data file with skill definitions
- Skills have composite slugs: `{source}-{name}` (e.g. `clawhub-wordpress-pro`)
- Interface defines all skill properties including metadata and prevention tags

### API Layer
- **Separate Express server** at `/home/james/.openclaw/workspace/nomoreslop-api`
- Proxies ClawHub search API to avoid CORS issues
- Normalizes ClawHub responses to match our skill schema
- Rate limiting handled by ClawHub (50 requests/min)

### Frontend
- **`src/pages/skills.astro`** - Search UI with real-time results
- Local-first: instant filtering of local skills
- Debounced async search to ClawHub (300ms delay)
- Category filters for WordPress, Node.js, Security, General
- Deduplication via slug matching

## Features

### Search
- Full-text search across name, description, and tags
- Category filtering (clickable chips)
- Debounced input to prevent API spam
- Shows local results immediately, ClawHub results as they load

### Results Display
- **Local results** always shown first
- **ClawHub results** shown in separate section with "already in directory" badges
- Each card shows:
  - Skill name
  - Source badge (CLAWHUB/MANUAL/GITHUB)
  - Description
  - Tags (as chips)
  - Prevention patterns
  - Link to source

### Loading States
- Pulsing amber dot while searching ClawHub
- Graceful error handling (silently hide ClawHub section on error)
- "No results" messaging for empty searches

## Local Development

```bash
# Start Astro dev server
cd /home/james/.openclaw/workspace/nomoreslop-v2
npm run dev

# In another terminal, start API server
cd /home/james/.openclaw/workspace/nomoreslop-api
npm start
```

The page detects `localhost` and uses `http://localhost:3456` for API calls.

## Production Configuration

API base URL switches to `https://api.nomoreslop.com` in production.

### Required DNS
- `api.nomoreslop.com` → server IP

### Required Nginx Config
See `nomoreslop-api/nginx-snippet.conf`

### Required Systemd Service
See `nomoreslop-api/nomoreslop-api.service`

## Adding New Skills

Edit `src/data/skills.ts` and add to the `skills` array:

```ts
{
  slug: "clawhub-new-skill",
  name: "new-skill",
  category: "General",
  tags: ["tag1", "tag2"],
  description: "What the skill does",
  prevents: ["what it prevents"],
  sourceUrl: "https://clawhub.ai/skills/new-skill",
  source: "clawhub",
  featured: false,
  addedAt: "2026-04-21"
}
```

Rebuild: `npm run build`

## Deduplication Logic

Skills are identified by their composite slug. When ClawHub returns a skill that matches a local slug, it shows "✓ IN DIRECTORY" badge instead of suggesting download.

## Performance

- Local search is instant (client-side filter)
- ClawHub searches are debounced (300ms)
- API limits to 50 results max
- No caching (relies on ClawHub's API caching)

## Browser Support

Modern browsers only (ES6+, fetch API, async/await).
