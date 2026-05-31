# FilmDex — Agent Instructions

Conventions for any opencode agent working on this repo.

## Task workflow

For every feature task (`docs/tasks/NN-*.md`):

1. Implement the task per its spec
2. Delegate unit tests to the `testing` subagent
3. Run `npm run build` and `npm run test:run`
4. Mark the task complete in `docs/tasks.md` and add `Status: Complete` to the task file
5. Delegate to the `mobile-responsiveness` subagent for visual verification + fixes
6. **STOP and show the user a summary of the changes** — list files changed, build/test status, and the proposed commit message. Wait for explicit approval before committing.
7. Commit only after the user confirms

Never commit, amend, or push without explicit user approval, even when changes look obviously correct.

## Commit style

Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`).
One commit per task unless the user asks to split.

## Code style

- TypeScript everywhere
- Path alias `@/*` → `src/*` (never relative imports for `src/` modules)
- Tailwind v4 utility classes; responsive prefixes `sm:`, `md:`, `lg:`
- Shadcn primitives live in `src/components/ui/` — do not edit, wrap or restyle at consumer sites
- Tests co-located: `Foo.tsx` → `Foo.test.tsx`

## Subagents

- `testing` — Vitest + RTL unit tests, has Chrome DevTools MCP for jsdom gaps
- `mobile-responsiveness` — real-browser layout audit + fixes via Chrome DevTools MCP
- `explore` — codebase research
- `general` — multi-step research/execution
