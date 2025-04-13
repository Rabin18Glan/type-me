import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Gauge, BarChart2, AlertTriangle } from "lucide-react"
import type { TypingSettings } from "@/types/typing"

interface TypingMetricsProps {
  metrics: {
    wpm: number
    cpm: number
    accuracy: number
    errors: number
    elapsedTime: number
  }
  settings: TypingSettings
}

export default function TypingMetrics({ metrics, settings }: TypingMetricsProps) {
  const { wpm, cpm, accuracy, errors, elapsedTime } = metrics

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        title="WPM"
        value={Math.round(wpm)}
        description="Words per minute"
        icon={<Gauge className="h-5 w-5 text-emerald-400" />}
      />

      <MetricCard
        title="CPM"
        value={Math.round(cpm)}
        description="Characters per minute"
        icon={<BarChart2 className="h-5 w-5 text-blue-400" />}
      />

      <MetricCard
        title="Accuracy"
        value={`${Math.round(accuracy)}%`}
        description="Typing accuracy"
        icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
      />

      <MetricCard
        title="Time"
        value={`${Math.round(elapsedTime)}s`}
        description={settings.duration > 0 ? `of ${settings.duration}s` : "elapsed"}
        icon={<Clock className="h-5 w-5 text-purple-400" />}
      />
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number | string
  description: string
  icon: React.ReactNode
}

function MetricCard({ title, value, description, icon }: MetricCardProps) {
  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-slate-500">{description}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
