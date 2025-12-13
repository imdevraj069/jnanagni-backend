"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LineChart({ title, data, dataKey, valueKey, color = "primary" }) {
  const maxValue = Math.max(...data.map((item) => item[valueKey]))
  const height = 200

  const points = data
    .map((item, i) => {
      const x = (i / (data.length - 1)) * 100
      const y = 100 - (item[valueKey] / maxValue) * 100
      return `${x},${y}`
    })
    .join(" ")

  const colorClasses = {
    primary: "#3b82f6",
    success: "#10b981",
    warning: "#f59e0b",
    accent: "#06b6d4",
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <svg viewBox="0 0 100 100" className="w-full h-64" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colorClasses[color]} stopOpacity="0.3" />
              <stop offset="100%" stopColor={colorClasses[color]} stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            points={`0,100 ${points} 100,100`}
            fill={`url(#gradient-${color})`}
            stroke="none"
          />

          <motion.polyline
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            points={points}
            fill="none"
            stroke={colorClasses[color]}
            strokeWidth="0.5"
            className="drop-shadow-lg"
          />

          {data.map((item, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = 100 - (item[valueKey] / maxValue) * 100
            return (
              <motion.circle
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                cx={x}
                cy={y}
                r="1"
                fill={colorClasses[color]}
                className="drop-shadow-lg"
              />
            )
          })}
        </svg>

        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          {data.map((item, i) => (
            <span key={i}>{item[dataKey]}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
