"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PieChart({ title, data, dataKey, valueKey }) {
  const total = data.reduce((sum, item) => sum + item[valueKey], 0)
  const colors = ["#3b82f6", "#06b6d4", "#10b981", "#f59e0b", "#8b5cf6"]

  let currentAngle = -90

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <svg viewBox="0 0 100 100" className="w-48 h-48">
            {data.map((item, i) => {
              const percentage = (item[valueKey] / total) * 100
              const angle = (percentage / 100) * 360
              const startAngle = currentAngle
              const endAngle = currentAngle + angle

              currentAngle = endAngle

              const startRad = (startAngle * Math.PI) / 180
              const endRad = (endAngle * Math.PI) / 180

              const x1 = 50 + 40 * Math.cos(startRad)
              const y1 = 50 + 40 * Math.sin(startRad)
              const x2 = 50 + 40 * Math.cos(endRad)
              const y2 = 50 + 40 * Math.sin(endRad)

              const largeArc = angle > 180 ? 1 : 0

              return (
                <motion.path
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[i % colors.length]}
                  className="drop-shadow-lg"
                />
              )
            })}
            <circle cx="50" cy="50" r="25" fill="var(--color-card)" />
          </svg>

          <div className="flex-1 space-y-2">
            {data.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                  <span className="text-sm text-muted-foreground">{item[dataKey]}</span>
                </div>
                <span className="text-sm font-medium">{item[valueKey]}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
