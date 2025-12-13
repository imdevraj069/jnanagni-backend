"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { CreateEventModal } from "@/components/modals/create-event-modal"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth-store"
import { getEvents, getCategories, createEvent } from "@/lib/api" // FIX
import { Badge } from "@/components/ui/badge"

export default function LeadEventsPage() {
  const { user } = useAuthStore()
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, categoriesData] = await Promise.all([getEvents(), getCategories()])

        const myCategories = categoriesData.data?.filter((cat) => cat.lead?._id === user._id) || []
        const myEvents = eventsData.data?.filter((evt) => myCategories.some((cat) => cat._id === evt.category?._id)) || []

        setCategories(myCategories)
        setEvents(myEvents)
      } catch (error) {
        console.error("Failed to fetch events:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleCreateEvent = async (formData) => {
    try {
      const response = await createEvent(formData)
      setEvents([...events, response.data])
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to create event:", error)
    }
  }

  // ... columns ...
  const columns = [
    { key: "name", label: "Event Name" },
    { key: "category", label: "Category", render: (value) => <Badge variant="outline" className="border-primary/30 text-primary">{value?.name}</Badge> },
    { key: "date", label: "Date", render: (value) => <span className="text-sm">{new Date(value).toLocaleDateString()}</span> },
    { key: "location", label: "Location" },
    { key: "maxParticipants", label: "Capacity", render: (value) => <span className="font-medium">{value}</span> },
  ]

  if (loading) return (<DashboardWrapper title="My Events" requiredRole="category_lead">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="My Events" requiredRole="category_lead">
      <div className="space-y-6">
        {events.length === 0 ? (
          <EmptyState title="No events yet" description="Create your first event in your categories" actionLabel={categories.length > 0 ? "Create Event" : undefined} onAction={categories.length > 0 ? () => setIsModalOpen(true) : undefined} />
        ) : (
          <DataTable title="Events in My Categories" columns={columns} data={events} searchable actions={<Button onClick={() => setIsModalOpen(true)} className="glow-primary">Create Event</Button>} />
        )}
      </div>
      <CreateEventModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateEvent} categories={categories} />
    </DashboardWrapper>
  )
}