"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { StatCard } from "@/components/dashboard/stat-card"
import { useAuthStore } from "@/store/auth-store"
import { getEvents } from "@/lib/api" // FIX

export default function CoordinatorDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ myEvents: 0, totalVolunteers: 0, totalRegistrations: 0, pendingTasks: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await getEvents()
        const myEvents = events.data?.filter((evt) => evt.coordinators?.some((coord) => coord._id === user._id)) || []
        setStats({ myEvents: myEvents.length, totalVolunteers: 0, totalRegistrations: 0, pendingTasks: 0 })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading) return (<DashboardWrapper title="Coordinator Dashboard" requiredRole="event_coordinator">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="Coordinator Dashboard" requiredRole="event_coordinator">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="My Events" value={stats.myEvents} index={0} />
          {/* ... */}
        </div>
      </div>
    </DashboardWrapper>
  )
}