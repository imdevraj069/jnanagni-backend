"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { useAuthStore } from "@/store/auth-store"
import { getEvents, getRegistrationsByEvent, updateRegistrationStatus } from "@/lib/api" // FIX
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function CoordinatorRegistrationsPage() {
  const { user } = useAuthStore()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await getEvents()
        const myEvents = events.data?.filter((evt) => evt.coordinators?.some((coord) => coord._id === user._id)) || []
        const allRegistrations = []
        for (const event of myEvents) {
          try {
            const regs = await getRegistrationsByEvent(event._id)
            const registrationsList = regs.registrations || []
            allRegistrations.push(...registrationsList.data.map((reg) => ({ ...reg, eventName: event.name })))
          } catch (error) {
            console.error(`Failed to fetch registrations for event ${event._id}:`, error)
          }
        }
        setRegistrations(allRegistrations)
      } catch (error) {
        console.error("Failed to fetch registrations:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const handleStatusUpdate = async (registrationId, newStatus) => {
    try {
      await updateRegistrationStatus(registrationId, newStatus)
      setRegistrations(registrations.map((reg) => (reg._id === registrationId ? { ...reg, status: newStatus } : reg)))
    } catch (error) {
      console.error("Failed to update registration status:", error)
    }
  }

  // ... columns ...
  const columns = [
    { key: "user", label: "Participant", render: (value) => value?.name || "Unknown" },
    { key: "eventName", label: "Event", render: (value) => <span className="font-medium">{value}</span> },
    { key: "status", label: "Status", render: (value) => <Badge variant={value === 'approved' ? 'default' : 'secondary'} className="capitalize">{value}</Badge> },
    { key: "registeredAt", label: "Registered", render: (value) => <span className="text-sm text-muted-foreground">{new Date(value).toLocaleDateString()}</span> },
    {
      key: "_id",
      label: "Actions",
      render: (value, row) => row.status === "pending" ? (
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => handleStatusUpdate(value, "approved")}>Approve</Button>
            <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(value, "rejected")}>Reject</Button>
          </div>
        ) : null,
    },
  ]

  if (loading) return (<DashboardWrapper title="Registrations" requiredRole="event_coordinator">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="Registrations" requiredRole="event_coordinator">
      <div className="space-y-6">
        {registrations.length === 0 ? (
          <EmptyState title="No registrations yet" description="No one has registered for your events yet" />
        ) : (
          <DataTable title="Event Registrations" columns={columns} data={registrations} searchable />
        )}
      </div>
    </DashboardWrapper>
  )
}