import { ThemeProvider } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ModeToggle } from '@/components/mode-toggle'

function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex items-center justify-between px-4 py-3">
              <h1 className="text-2xl font-bold tracking-tight">FilmDex</h1>
              <ModeToggle />
            </div>
          </header>
          <main className="container mx-auto px-4 py-6">
            {/* movie grid goes here in task 07 */}
          </main>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
