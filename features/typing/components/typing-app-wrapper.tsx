"use client"

import { ErrorBoundary } from "react-error-boundary"
import TypingApp from "@/features/typing/components/typing-app"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function TypingAppWrapper() {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="p-6 bg-red-900/20 border border-red-800 rounded-lg text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
            <p className="mb-4 text-slate-300">{error.message}</p>
            <Button onClick={resetErrorBoundary}>Try again</Button>
          </div>
        </div>
      )}
    >
      <TypingApp />
    </ErrorBoundary>
  )
}
