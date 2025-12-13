"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { useAuthStore } from "@/store/auth-store"
import { getCategories } from "@/lib/api" // FIX
import { Badge } from "@/components/ui/badge"

export default function LeadCategoriesPage() {
  const { user } = useAuthStore()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCategories()
        const myCategories = response.data?.filter((cat) => cat.lead?._id === user._id) || []
        setCategories(myCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const columns = [
    { key: "name", label: "Category Name" },
    { key: "description", label: "Description", render: (value) => <span className="text-muted-foreground">{value || "No description"}</span> },
    { key: "eventsCount", label: "Events", render: (value) => <span className="font-medium">{value || 0}</span> },
    { key: "status", label: "Status", render: () => <Badge variant="default">Active</Badge> },
  ]

  if (loading) return (<DashboardWrapper title="My Categories" requiredRole="category_lead">Loading...</DashboardWrapper>)

  return (
    <DashboardWrapper title="My Categories" requiredRole="category_lead">
      <div className="space-y-6">
        {categories.length === 0 ? (
          <EmptyState icon={<span />} title="No categories assigned" description="You haven't been assigned any categories yet." />
        ) : (
          <DataTable title="My Categories" columns={columns} data={categories} searchable />
        )}
      </div>
    </DashboardWrapper>
  )
}