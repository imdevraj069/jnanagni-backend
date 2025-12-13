"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { getUsersByRole } from "@/lib/api" // FIX
import { Badge } from "@/components/ui/badge"

export default function CoordinatorVolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsersByRole("volunteer")
        setVolunteers(response.data || [])
      } catch (error) {
        console.error("Failed to fetch volunteers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "jnanagniId", label: "ID", render: (value) => <Badge variant="secondary" className="font-mono">{value}</Badge> },
    { key: "assignedEvents", label: "Assigned Events", render: () => <span className="font-medium">0</span> },
    { key: "status", label: "Status", render: () => <Badge variant="default">Active</Badge> },
  ]

  if (loading) return (<DashboardWrapper title="Volunteers" requiredRole="event_coordinator">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="Volunteers" requiredRole="event_coordinator">
      <div className="space-y-6">
        <DataTable title="Event Volunteers" columns={columns} data={volunteers} searchable />
      </div>
    </DashboardWrapper>
  )
}