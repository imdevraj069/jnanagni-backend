"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { StatCard } from "@/components/dashboard/stat-card"
import { useAuthStore } from "@/store/auth-store"
import { getEvents } from "@/lib/api" // FIX

export default function VolunteerDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ assignedEvents: 0, completedTasks: 0, pendingTasks: 0, hoursLogged: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await getEvents()
        const myEvents = events.data?.filter((evt) => evt.volunteers?.some((vol) => vol._id === user._id)) || []
        setStats({ assignedEvents: myEvents.length, completedTasks: 0, pendingTasks: 0, hoursLogged: 0 })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading) return (<DashboardWrapper title="Volunteer Dashboard" requiredRole="volunteer">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="Volunteer Dashboard" requiredRole="volunteer">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Assigned Events" value={stats.assignedEvents} index={0} />
          {/* ... */}
        </div>
      </div>
    </DashboardWrapper>
  )
}