# Task 07 — Movie Card (Front)

Build the `MovieCard` component with its flip mechanism and front face. The
back face is empty for now — it gets filled in task 08.

---

## File

**`src/components/MovieCard.tsx`**

Accepts a single `movie: Movie` prop.

---

## Flip mechanism

Implemented in pure CSS (no animation library). Requires three Tailwind
utilities — Tailwind v4 includes them all:

- `perspective-[1000px]` on the outer container
- `transform-style-preserve-3d` on the flipping inner div
- `backface-hidden` on both faces
- `rotate-y-180` applied conditionally on the inner div when flipped

State: a local `useState<boolean>(false)` called `isFlipped`. Click on the
card toggles it. Clicking the card again (front or back face) flips it back.

---

## Structure

```tsx
<div className="aspect-[2/3] perspective-[1000px] cursor-pointer">
  <div
    className={cn(
      "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d",
      isFlipped && "rotate-y-180"
    )}
    onClick={() => setIsFlipped(f => !f)}
  >
    <div className="absolute inset-0 backface-hidden">
      {/* FRONT — this task */}
    </div>
    <div className="absolute inset-0 backface-hidden rotate-y-180">
      {/* BACK — task 08 */}
    </div>
  </div>
</div>
```

---

## Front face

Full-bleed poster with two badges overlaid:

- `<img src={movie.poster} />` — `object-cover w-full h-full rounded-lg`
- **Top-left:** Shadcn `<Badge>` showing the rank (`#1`, `#2`, etc.)
- **Top-right:** Shadcn `<Badge variant="secondary">` showing the rating to 1 decimal place (e.g. `8.7`)
- Badges positioned with `absolute top-2 left-2` / `top-2 right-2`

### Skeleton while loading

- Local `useState<boolean>(false)` called `imageLoaded`
- `<Skeleton className="absolute inset-0 rounded-lg" />` shown while `!imageLoaded`
- `<img>` has `onLoad={() => setImageLoaded(true)}`
- Image starts with `opacity-0`, becomes `opacity-100` once loaded (with `transition-opacity`)

---

## Tests

**`src/components/MovieCard.test.tsx`** (front-face tests — extended in task 09)
- Renders the poster `<img>` with the correct `src` and `alt`
- Shows the rank badge (`#1`, etc) and rating badge (formatted to 1 decimal)
- Skeleton placeholder is visible before the image fires `onLoad`
- Skeleton disappears after firing `onLoad` on the `<img>`
- Clicking the card sets the flipped state (assert via class on the inner div, e.g. `rotate-y-180`)
- Clicking the card a second time un-flips it

---

## Done when

- Each card shows its poster, rank badge, and rating badge on the front
- Skeleton placeholder visible until the image loads, then fades in
- Clicking the card flips it (the back is blank for now, but the flip animation works)
- Clicking again flips it back
- `npm run build` passes
