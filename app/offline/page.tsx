import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WifiOff } from "lucide-react"

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
      <WifiOff className="h-24 w-24 mb-6 text-slate-400" />
      <h1 className="text-3xl font-bold mb-4">You're offline</h1>
      <p className="text-slate-400 mb-8 text-center max-w-md">
        Don't worry! You can still practice typing with previously loaded texts. Connect to the internet to get new
        content.
      </p>
      <Button asChild>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  )
}
