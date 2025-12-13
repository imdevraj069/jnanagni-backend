"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { useAuthStore } from "@/store/auth-store"
import { getEvents, getRegistrationsByEvent } from "@/lib/api" // FIX
import { Badge } from "@/components/ui/badge"

export default function VolunteerRegistrationsPage() {
  const { user } = useAuthStore()
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events = await getEvents()
        const myEvents = events.data?.filter((evt) => evt.volunteers?.some((vol) => vol._id === user._id)) || []
        const allRegistrations = []
        for (const event of myEvents) {
          try {
            const regs = await getRegistrationsByEvent(event._id)
            allRegistrations.push(...regs.data.map((reg) => ({ ...reg, eventName: event.name })))
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

  const columns = [
    { key: "user", label: "Participant", render: (value) => value?.name || "Unknown" },
    { key: "eventName", label: "Event", render: (value) => <span className="font-medium">{value}</span> },
    { key: "status", label: "Status", render: (value) => <Badge variant="secondary" className="capitalize">{value}</Badge> },
    { key: "registeredAt", label: "Registered", render: (value) => <span className="text-sm text-muted-foreground">{new Date(value).toLocaleDateString()}</span> },
  ]

  if (loading) return (<DashboardWrapper title="Registrations" requiredRole="volunteer">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="Registrations" requiredRole="volunteer">
      <div className="space-y-6">
        {registrations.length === 0 ? (
          <EmptyState title="No registrations" description="No registrations found for your assigned events" />
        ) : (
          <DataTable title="Event Registrations" columns={columns} data={registrations} searchable />
        )}
      </div>
    </DashboardWrapper>
  )
}