import { Suspense } from "react"
import TypingAppWrapper from "@/features/typing/components/typing-app-wrapper"
import { LoadingScreen } from "@/components/ui/loading-screen"

export default function Home() {
  return (
    <main className="min-h-screen gradient-bg-primary text-white">
      <Suspense fallback={<LoadingScreen />}>
        <TypingAppWrapper />
      </Suspense>
    </main>
  )
}
