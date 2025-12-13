"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { StatCard } from "@/components/dashboard/stat-card"
import { useAuthStore } from "@/store/auth-store"
import { getCategories, getEvents } from "@/lib/api" // FIX

export default function LeadDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ myCategories: 0, totalEvents: 0, totalCoordinators: 0, pendingRegistrations: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, events] = await Promise.all([getCategories(), getEvents()])
        const myCategories = categories.data?.filter((cat) => cat.lead?._id === user._id) || []
        const myEvents = events.data?.filter((evt) => myCategories.some((cat) => cat._id === evt.category?._id)) || []

        setStats({
          myCategories: myCategories.length,
          totalEvents: myEvents.length,
          totalCoordinators: 0,
          pendingRegistrations: 0,
        })
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  if (loading) return (<DashboardWrapper title="Category Lead Dashboard" requiredRole="category_lead">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="Category Lead Dashboard" requiredRole="category_lead">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="My Categories" value={stats.myCategories} index={0} />
          <StatCard title="Total Events" value={stats.totalEvents} index={1} />
          {/* ... other cards ... */}
        </div>
      </div>
    </DashboardWrapper>
  )
}