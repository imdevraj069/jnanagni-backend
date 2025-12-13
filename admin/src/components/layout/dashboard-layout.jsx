"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

export function DashboardLayout({ children, title }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background grid-pattern">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Header title={title} sidebarCollapsed={sidebarCollapsed} />

      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 80 : 256,
          paddingTop: 64,
        }}
        className="min-h-screen p-6"
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {children}
        </motion.div>
      </motion.main>
    </div>
  )
}
