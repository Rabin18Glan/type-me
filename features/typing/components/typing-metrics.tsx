"use client"

import type React from "react"
import { useTyping } from "@/features/typing/context/typing-context"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Gauge, BarChart2, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface TypingMetricsProps {
  compact?: boolean
  centered?: boolean
  horizontal?: boolean
}

export default function TypingMetrics({ compact = false, centered = false, horizontal = false }: TypingMetricsProps) {
  const { metrics, settings, startTime, endTime } = useTyping()
  const { wpm, cpm, accuracy, errors } = metrics
  const [elapsedTime, setElapsedTime] = useState(metrics.elapsedTime)

  // Update elapsed time in real-time
  useEffect(() => {
    if (!startTime) {
      setElapsedTime(0)
      return
    }

    if (endTime) {
      setElapsedTime((endTime - startTime) / 1000)
      return
    }

    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000)
    }, 100)

    return () => clearInterval(interval)
  }, [startTime, endTime])

  // Format time display
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`
    }
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.round(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  // Different layouts based on props
  if (centered) {
    return (
      <div className="flex flex-wrap justify-center gap-4 max-w-2xl mx-auto">
        <MetricCard
          title="WPM"
          value={Math.round(wpm)}
          description="Words per minute"
          icon={<Gauge className="h-5 w-5 text-emerald-400" />}
          gradient="from-emerald-500 to-green-500"
          large
        />
        <MetricCard
          title="CPM"
          value={Math.round(cpm)}
          description="Characters per minute"
          icon={<BarChart2 className="h-5 w-5 text-blue-400" />}
          gradient="from-blue-500 to-cyan-500"
          large
        />
        <MetricCard
          title="Accuracy"
          value={`${Math.round(accuracy)}%`}
          description="Typing accuracy"
          icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
          gradient="from-amber-500 to-yellow-500"
          large
        />
        <MetricCard
          title="Time"
          value={formatTime(elapsedTime)}
          description={settings.duration > 0 ? `of ${formatTime(settings.duration)}` : "elapsed"}
          icon={<Clock className="h-5 w-5 text-purple-400" />}
          gradient="from-purple-500 to-pink-500"
          large
        />
      </div>
    )
  }

  if (compact && horizontal) {
    return (
      <div className="grid grid-cols-4 gap-2">
        <HorizontalMetricCard
          title="WPM"
          value={Math.round(wpm)}
          icon={<Gauge className="h-4 w-4 text-emerald-400" />}
          gradient="from-emerald-500 to-green-500"
        />
        <HorizontalMetricCard
          title="CPM"
          value={Math.round(cpm)}
          icon={<BarChart2 className="h-4 w-4 text-blue-400" />}
          gradient="from-blue-500 to-cyan-500"
        />
        <HorizontalMetricCard
          title="Accuracy"
          value={`${Math.round(accuracy)}%`}
          icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
          gradient="from-amber-500 to-yellow-500"
        />
        <HorizontalMetricCard
          title="Time"
          value={formatTime(elapsedTime)}
          icon={<Clock className="h-4 w-4 text-purple-400" />}
          gradient="from-purple-500 to-pink-500"
        />
      </div>
    )
  }

  if (compact) {
    return (
      <div className="space-y-3">
        <CompactMetricCard
          title="WPM"
          value={Math.round(wpm)}
          icon={<Gauge className="h-4 w-4 text-emerald-400" />}
          gradient="from-emerald-500 to-green-500"
        />
        <CompactMetricCard
          title="CPM"
          value={Math.round(cpm)}
          icon={<BarChart2 className="h-4 w-4 text-blue-400" />}
          gradient="from-blue-500 to-cyan-500"
        />
        <CompactMetricCard
          title="Accuracy"
          value={`${Math.round(accuracy)}%`}
          icon={<AlertTriangle className="h-4 w-4 text-amber-400" />}
          gradient="from-amber-500 to-yellow-500"
        />
        <CompactMetricCard
          title="Time"
          value={formatTime(elapsedTime)}
          icon={<Clock className="h-4 w-4 text-purple-400" />}
          gradient="from-purple-500 to-pink-500"
        />
      </div>
    )
  }

  // Default grid layout
  return (
    <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" initial="hidden" animate="show">
      <MetricCard
        title="WPM"
        value={Math.round(wpm)}
        description="Words per minute"
        icon={<Gauge className="h-5 w-5 text-emerald-400" />}
        gradient="from-emerald-500 to-green-500"
      />
      <MetricCard
        title="CPM"
        value={Math.round(cpm)}
        description="Characters per minute"
        icon={<BarChart2 className="h-5 w-5 text-blue-400" />}
        gradient="from-blue-500 to-cyan-500"
      />
      <MetricCard
        title="Accuracy"
        value={`${Math.round(accuracy)}%`}
        description="Typing accuracy"
        icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
        gradient="from-amber-500 to-yellow-500"
      />
      <MetricCard
        title="Time"
        value={formatTime(elapsedTime)}
        description={settings.duration > 0 ? `of ${formatTime(settings.duration)}` : "elapsed"}
        icon={<Clock className="h-5 w-5 text-purple-400" />}
        gradient="from-purple-500 to-pink-500"
      />
    </motion.div>
  )
}

interface MetricCardProps {
  title: string
  value: number | string
  description?: string
  icon: React.ReactNode
  gradient: string
  large?: boolean
}

function MetricCard({ title, value, description, icon, gradient, large = false }: MetricCardProps) {
  return (
    <Card
      className={`border-slate-700/50 shadow-lg overflow-hidden relative group hover:border-slate-600/80 transition-colors ${
        large ? "min-w-[150px]" : ""
      }`}
    >
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-800/80 pointer-events-none"></div>
      <CardContent className={`${large ? "p-5" : "p-4"} relative`}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p
              className={`${large ? "text-4xl" : "text-3xl"} font-bold mt-1 group-hover:scale-105 transition-transform`}
            >
              {value}
            </p>
            {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
          </div>
          <div className="p-2 rounded-full bg-slate-800/80 group-hover:scale-110 transition-transform">{icon}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function CompactMetricCard({ title, value, icon, gradient }: Omit<MetricCardProps, "description">) {
  return (
    <Card className="border-slate-700/50 shadow-lg overflow-hidden relative group hover:border-slate-600/80 transition-colors">
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradient}`}></div>
      <CardContent className="p-3 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-slate-800/80">{icon}</div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
          </div>
          <p className="text-xl font-bold group-hover:scale-105 transition-transform">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function HorizontalMetricCard({ title, value, icon, gradient }: Omit<MetricCardProps, "description">) {
  return (
    <Card className="border-slate-700/50 shadow-lg overflow-hidden relative group hover:border-slate-600/80 transition-colors">
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}></div>
      <CardContent className="p-2 relative">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1 mb-1">
            {icon}
            <p className="text-xs font-medium text-slate-400">{title}</p>
          </div>
          <p className="text-xl font-bold group-hover:scale-105 transition-transform">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
