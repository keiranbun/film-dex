# Task 08 — Movie Card (Back)

Fill in the back face of `MovieCard` with the movie's metadata and Australian
streaming availability.

---

## Back face content

Stacked vertically inside the back face container:

1. **Title** — `movie.title`, large + bold, truncated to 2 lines max
2. **Year** — `movie.year`, smaller + muted
3. **Streaming services** — horizontal row of logos (see below)
4. **Empty state** — if `movie.streaming_au` is empty, show the message:
   _"Not available for streaming in AU"_

Layout:
- `flex flex-col` with `p-4 gap-3`
- Background uses `bg-card text-card-foreground rounded-lg`
- Same dimensions as the front (already enforced by aspect ratio on the parent)

---

## Streaming logos

For each service in `movie.streaming_au`:

- Render the `logo` as a square image, `w-10 h-10 rounded`
- Wrap in Shadcn `<Tooltip>` so hovering shows `service.name`
- No text labels visible by default — logos only

### Overflow handling

The number of services per film varies. Wrap the row in Shadcn `<ScrollArea>`
to prevent overflow breaking the card layout:

```tsx
<ScrollArea className="flex-1">
  <div className="flex flex-wrap gap-2">
    {movie.streaming_au.map(service => (
      <Tooltip key={service.name}>
        <TooltipTrigger asChild>
          <img src={service.logo} alt={service.name} className="w-10 h-10 rounded" />
        </TooltipTrigger>
        <TooltipContent>{service.name}</TooltipContent>
      </Tooltip>
    ))}
  </div>
</ScrollArea>
```

---

## Click handling

The back face is also clickable to flip back to the front, but **clicking a
logo (or its tooltip) should not flip the card**. Use `e.stopPropagation()` on
the logo image's click handler — or wrap the logo row in a `<div onClick={e => e.stopPropagation()}>`.

---

## Tests

Extend **`src/components/MovieCard.test.tsx`** with back-face tests:

- After flipping, the back face shows `movie.title` and `movie.year`
- Renders one `<img>` per entry in `movie.streaming_au` with the correct `src` and `alt`
- Hovering a logo shows a tooltip with the service name (use `userEvent.hover`)
- When `movie.streaming_au` is empty, shows the message `"Not available for streaming in AU"` (and renders no logos)
- Clicking a streaming logo does **not** flip the card back to the front
- Clicking elsewhere on the back face flips it back to the front

> Wrap the rendered component in a `<TooltipProvider>` in the test render helper, or the tooltip won't mount.

---

## Done when

- Back face shows title, year, and streaming logos
- Hovering a logo shows the service name in a tooltip
- Films with no AU streaming show the empty-state message
- Logos overflow gracefully via scroll without breaking card height
- Clicking the back of the card (outside the logos) flips it back
- Clicking a logo does not flip the card
- `npm run build` passes
