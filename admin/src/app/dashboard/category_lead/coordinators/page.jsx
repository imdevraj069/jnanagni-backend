"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { useAuthStore } from "@/store/auth-store"
import { getUsersByRole } from "@/lib/api" // FIX
import { Badge } from "@/components/ui/badge"

export default function LeadCoordinatorsPage() {
  const { user } = useAuthStore()
  const [coordinators, setCoordinators] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsersByRole("event_coordinator")
        setCoordinators(response.data || [])
      } catch (error) {
        console.error("Failed to fetch coordinators:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "jnanagniId", label: "ID", render: (value) => <Badge variant="secondary" className="font-mono">{value}</Badge> },
    { key: "assignedEvents", label: "Assigned Events", render: () => <span className="font-medium">0</span> },
  ]

  if (loading) return (<DashboardWrapper title="Coordinators" requiredRole="category_lead">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="Coordinators" requiredRole="category_lead">
      <div className="space-y-6">
        <DataTable title="Event Coordinators" columns={columns} data={coordinators} searchable />
      </div>
    </DashboardWrapper>
  )
}