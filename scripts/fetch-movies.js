// scripts/fetch-movies.js
// Fetches TMDB top 100 movies + Australian streaming availability
// and writes the result to data/movies.json
//
// Usage:
//   node --env-file=.env scripts/fetch-movies.js
//
// Requires TMDB_TOKEN in .env (Bearer token from themoviedb.org)

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

const TOKEN = process.env.TMDB_TOKEN
if (!TOKEN) {
  console.error('Error: TMDB_TOKEN is not set. Add it to .env and run with --env-file=.env')
  process.exit(1)
}

const BASE = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'
const HEADERS = { Authorization: `Bearer ${TOKEN}` }

async function tmdb(path) {
  const res = await fetch(`${BASE}${path}`, { headers: HEADERS })
  if (!res.ok) throw new Error(`TMDB ${path} → ${res.status} ${res.statusText}`)
  return res.json()
}

// Minimum vote count to exclude small-sample-size outliers
// (e.g. recent niche releases with very few but glowing votes).
const MIN_VOTE_COUNT = 10000

async function fetchTopRated() {
  const movies = []
  for (let page = 1; page <= 5; page++) {
    process.stdout.write(`Fetching top-rated page ${page}/5...\r`)
    const data = await tmdb(
      `/discover/movie?language=en-US&sort_by=vote_average.desc&vote_count.gte=${MIN_VOTE_COUNT}&page=${page}`
    )
    movies.push(...data.results)
  }
  console.log('\nFetched 100 movies.')
  return movies.slice(0, 100)
}

async function fetchStreamingAU(movieId) {
  const data = await tmdb(`/movie/${movieId}/watch/providers`)
  const au = data.results?.AU
  if (!au || !au.flatrate) return []
  return au.flatrate.map((p) => ({
    name: p.provider_name,
    logo: `${IMAGE_BASE}/original${p.logo_path}`,
  }))
}

async function main() {
  console.log('Starting TMDB fetch...\n')

  const raw = await fetchTopRated()

  const movies = []
  for (let i = 0; i < raw.length; i++) {
    const m = raw[i]
    process.stdout.write(`Fetching streaming data ${i + 1}/100 — ${m.title}...\r`)
    const streaming_au = await fetchStreamingAU(m.id)
    movies.push({
      id: m.id,
      rank: i + 1,
      title: m.title,
      year: parseInt(m.release_date?.split('-')[0] ?? '0'),
      poster: m.poster_path ? `${IMAGE_BASE}/w500${m.poster_path}` : null,
      rating: m.vote_average,
      streaming_au,
    })
  }

  console.log('\n\nAll done. Writing data/movies.json...')

  mkdirSync(join(ROOT, 'data'), { recursive: true })
  writeFileSync(
    join(ROOT, 'data', 'movies.json'),
    JSON.stringify(movies, null, 2),
    'utf-8'
  )

  const withStreaming = movies.filter((m) => m.streaming_au.length > 0).length
  console.log(`Written ${movies.length} movies (${withStreaming} available on AU streaming).`)
}

main().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
