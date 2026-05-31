# FilmDex

[Website Link](https://film-dex-rho.vercel.app/)

Top 100 movies on TMDB, with Australian streaming availability for each.
Flip a card to see where to watch. Mark what you've seen, filter by service,
export your watchlist as JSON.

Built as a sandbox for testing agentic AI development workflows.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 + Shadcn
- TMDB API (data fetched once via script, committed as JSON)
- Vitest + React Testing Library

## Tools

- [Opencode](https://opencode.ai)
- Cursor IDE
- Fedora Linux

## LLM

- Claude Sonnet 4.6 (High) — planning and architecture
- Claude Opus 4.7 (Med) — feature build

## MCP

- [chrome-devtools](https://github.com/ChromeDevTools/chrome-devtools-mcp/) — real-browser testing and responsive auditing

## Agents

Two custom subagents were written for this project:

- **mobile-responsiveness** - audits the app at multiple viewport sizes using the Chrome DevTools MCP, finds layout issues (overflow, clipping, touch targets), and patches Tailwind classes. Runs automatically after each feature lands.
- **testing** - writes and runs Vitest + React Testing Library unit tests. Falls back to the Chrome DevTools MCP when jsdom can't simulate browser behavior accurately.

## Thoughts

- Using `chrome-devtools` MCP was such a good experience and made Opencode much more reliable
- Using task files and keeping them to a minimum helped the AI one-shot them
- I actually had a lot of fun building this application using an agentic workflow

## Mistakes

- At one point the AI randomly started committing after each feature without my input, to fix this I asked the LLM to always ask for my permission before committing the files

## Docs

- [Project overview](./docs/overview.md)
- [Tasks](./docs/tasks.md)
