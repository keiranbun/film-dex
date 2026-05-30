# Task 02 — Scaffold Project

Set up the base Vite + React + TypeScript project.

---

## Steps

### 1. Initialise Vite

Run from the repo root:

```bash
npm create vite@latest . -- --template react-ts
```

Accept the prompt to scaffold into the existing directory.

### 2. Install base dependencies

```bash
npm install
```

### 3. Verify it runs

```bash
npm run dev
```

The default Vite + React page should load at `http://localhost:5173`.

### 4. Clean up boilerplate

Remove the default Vite starter content:
- Clear `src/App.tsx` down to a bare component
- Clear `src/App.css`
- Remove `src/assets/react.svg` and `public/vite.svg`

---

## Done when

- `npm run dev` starts without errors
- `src/App.tsx` is a clean empty component ready for feature work
