import { useRef, type ChangeEvent } from "react";
import { ListChecks } from "lucide-react";
import { toast } from "sonner";
import type { Movie } from "@/types/movie";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type WatchedIOProps = {
  movies: Movie[];
  watchedIds: Set<number>;
  onSetWatched: (ids: Set<number>) => void;
};

export function WatchedIO({
  movies,
  watchedIds,
  onSetWatched,
}: WatchedIOProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleExport() {
    const payload = {
      version: 1 as const,
      exportedAt: new Date().toISOString(),
      movies: movies.map((m) => ({
        id: m.id,
        title: m.title,
        watched: watchedIds.has(m.id),
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "filmdex-watchlist.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  async function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const parsed: unknown = JSON.parse(text);
      if (
        !parsed ||
        typeof parsed !== "object" ||
        (parsed as { version?: unknown }).version !== 1 ||
        !Array.isArray((parsed as { movies?: unknown }).movies)
      ) {
        throw new Error("bad shape");
      }
      const entries = (parsed as { movies: unknown[] }).movies;
      const next = new Set<number>();
      for (const entry of entries) {
        if (
          entry &&
          typeof entry === "object" &&
          typeof (entry as { id?: unknown }).id === "number" &&
          (entry as { watched?: unknown }).watched === true
        ) {
          next.add((entry as { id: number }).id);
        }
      }
      onSetWatched(next);
      toast.success(
        `Imported watchlist — ${next.size} movies marked as watched`,
      );
    } catch {
      toast.error("Invalid file — could not import watchlist");
    }
  }

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Watchlist">
                <ListChecks className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Watchlist</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onSelect={handleExport}
            className="min-h-10 sm:min-h-0"
          >
            Export…
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => fileInputRef.current?.click()}
            className="min-h-10 sm:min-h-0"
          >
            Import…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-label="Import watchlist file"
        onChange={handleFileChange}
      />
    </>
  );
}
