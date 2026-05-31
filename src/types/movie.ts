export type StreamingService = {
  name: string
  logo: string
}

export type Movie = {
  id: number
  rank: number
  title: string
  year: number
  poster: string
  rating: number
  streaming_au: StreamingService[]
}
