"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function DataTable({ title, columns, data, onRowClick, searchable = false, actions }) {
  const [searchQuery, setSearchQuery] = useState("")

  // FIX: Ensure data is always an array to prevent "filter is not a function" errors
  // If data is null/undefined, default to []
  const safeData = Array.isArray(data) ? data : []

  const filteredData = searchable
    ? safeData.filter((row) => {
        const searchStr = searchQuery.toLowerCase()
        return Object.values(row).some((value) => String(value).toLowerCase().includes(searchStr))
      })
    : safeData

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
          {searchable && (
            <div className="mt-4">
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm bg-input border-border/50"
              />
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  {columns.map((column) => (
                    <th key={column.key} className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-muted-foreground">
                      No data available
                    </td>
                  </tr>
                ) : (
                  filteredData.map((row, index) => (
                    <motion.tr
                      key={row.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="border-b border-border/30 transition-colors hover:bg-muted/30 cursor-pointer"
                      onClick={() => onRowClick?.(row)}
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3 text-sm text-foreground">
                          {column.render ? column.render(row[column.key], row) : row[column.key]}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}