"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BarChart({ title, data, dataKey, valueKey, color = "primary" }) {
  const maxValue = Math.max(...data.map((item) => item[valueKey]))

  const colorClasses = {
    primary: "from-primary to-accent",
    success: "from-success to-primary",
    warning: "from-warning to-accent",
    accent: "from-accent to-success",
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(item[valueKey] / maxValue) * 100}%` }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`w-full bg-gradient-to-t ${colorClasses[color]} rounded-t-md glow-${color} min-h-[4px]`}
                title={`${item[dataKey]}: ${item[valueKey]}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          {data.map((item, i) => (
            <span key={i} className="flex-1 text-center">
              {item[dataKey]}
            </span>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs font-medium">
          {data.map((item, i) => (
            <span key={i} className="flex-1 text-center text-foreground">
              {item[valueKey]}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
