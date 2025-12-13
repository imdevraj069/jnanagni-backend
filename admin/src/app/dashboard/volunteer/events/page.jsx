"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { useAuthStore } from "@/store/auth-store"
import { getEvents } from "@/lib/api" // FIX
import { Badge } from "@/components/ui/badge"

export default function VolunteerEventsPage() {
  const { user } = useAuthStore()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEvents()
        const myEvents = response.data?.filter((evt) => evt.volunteers?.some((vol) => vol._id === user._id)) || []
        setEvents(myEvents)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  // ... columns ...
  const columns = [
    { key: "name", label: "Event Name" },
    { key: "category", label: "Category", render: (value) => <Badge variant="outline" className="border-primary/30 text-primary">{value?.name}</Badge> },
    { key: "date", label: "Date", render: (value) => <span className="text-sm">{new Date(value).toLocaleDateString()}</span> },
    { key: "location", label: "Location", render: (value) => <span className="text-muted-foreground">{value}</span> },
    { key: "status", label: "My Status", render: () => <Badge variant="default">Active</Badge> },
  ]

  if (loading) return (<DashboardWrapper title="My Events" requiredRole="volunteer">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="My Events" requiredRole="volunteer">
      <div className="space-y-6">
        {events.length === 0 ? (
          <EmptyState title="No events assigned" description="You haven't been assigned to any events yet." />
        ) : (
          <DataTable title="My Assigned Events" columns={columns} data={events} searchable />
        )}
      </div>
    </DashboardWrapper>
  )
}