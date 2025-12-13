"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { CreateEventModal } from "@/components/modals/create-event-modal"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/store/dashboard-store"
import { getEvents, getCategories, createEvent } from "@/lib/api" // FIX: Named imports
import { Badge } from "@/components/ui/badge"

export default function EventsPage() {
  const { events, categories, setEvents, setCategories, addEvent } = useDashboardStore()
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, categoriesRes] = await Promise.all([
          getEvents(1, 100), 
          getCategories()
        ])
        const eventsData = eventsRes.data?.data || []
        const categoriesData = categoriesRes.data || []
        setEvents(eventsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [setEvents, setCategories])

  const handleCreateEvent = async (formData) => {
    try {
      const response = await createEvent(formData)
      addEvent(response.data)
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to create event:", error)
    }
  }

  const columns = [
    { key: "title", label: "Event Name" },
    { key: "category", label: "Category", render: (value) => <Badge variant="outline" className="font-mono border-primary/30 text-primary">{value?.name || "Uncategorized"}</Badge> },
    { key: "date", label: "Date", render: (value) => <span className="text-sm">{new Date(value).toLocaleDateString()}</span> },
    { key: "venue", label: "Location", render: (value) => <span className="text-muted-foreground">{value}</span> },
    { key: "volunteers", label: "Volunteers", render: (value) => <span className="font-medium">{value?.length || 0}</span> },
    { key: "isRegistrationOpen", label: "Status", render: (value) => <Badge variant={value ? "default" : "secondary"} className="capitalize">{value ? "Open" : "Closed"}</Badge> },
  ]

  if (loading) return (/* Loading UI */ <DashboardWrapper title="Events" requiredRole="admin"><div className="flex items-center justify-center h-96">Loading...</div></DashboardWrapper>)

  return (
    <DashboardWrapper title="Events" requiredRole="admin">
      <div className="space-y-6">
        {events.length === 0 ? (
          <EmptyState
            icon={<svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            title="No events yet"
            description="Create your first event to get started"
            actionLabel="Create Event"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <DataTable
            title="All Events"
            columns={columns}
            data={events}
            searchable
            actions={
              <Button onClick={() => setIsModalOpen(true)} className="glow-primary">
                Create Event
              </Button>
            }
          />
        )}
      </div>
      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
        categories={categories}
      />
    </DashboardWrapper>
  )
}