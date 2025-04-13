import { Loader2 } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse"></div>
        <Loader2 className="h-16 w-16 animate-spin text-emerald-500 relative z-10" />
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-2 gradient-primary">Loading TypeMe</h2>
      <p className="text-slate-400 text-center max-w-xs">Preparing your personalized typing experience...</p>
    </div>
  )
}
