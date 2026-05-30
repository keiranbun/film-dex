# Task 01 — Fetch Movies

**Status:** Complete

Generate `data/movies.json` from the TMDB API. This is a one-time script run
before the frontend is built. The output is committed to the repo so the app
has no runtime API dependency.

---

## Prerequisites

- Node 20.6+
- A TMDB API Read Access Token (Bearer token)

Add your token to a `.env` file in the project root:

```
TMDB_TOKEN=your_bearer_token_here
```

This file is gitignored and must never be committed.

---

## Script

**File:** `scripts/fetch-movies.js`

**Run:**
```bash
node --env-file=.env scripts/fetch-movies.js
```

**What it does:**
1. Fetches 5 pages of `/movie/top_rated` from TMDB (20 results per page = 100 films)
2. For each film, fetches `/movie/{id}/watch/providers` and filters to `AU` region, `flatrate` only (streaming — no rent/buy)
3. Writes the combined result to `data/movies.json`

---

## Output shape (`data/movies.json`)

```json
[
  {
    "id": 278,
    "rank": 1,
    "title": "The Shawshank Redemption",
    "year": 1994,
    "poster": "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    "rating": 8.7,
    "streaming_au": [
      {
        "name": "Netflix",
        "logo": "https://image.tmdb.org/t/p/original/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg"
      }
    ]
  }
]
```

---

## Done when

- `data/movies.json` exists
- It contains exactly 100 entries
- Each entry has a `streaming_au` array (empty array is valid — not all films are on streaming in AU)
