"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { EmptyState } from "@/components/dashboard/empty-state"
import { CreateCategoryModal } from "@/components/modals/create-category-modal"
import { Button } from "@/components/ui/button"
import { useDashboardStore } from "@/store/dashboard-store"
import { getCategories, getUsersByRole, createCategory } from "@/lib/api" // FIX: Named imports
import { Badge } from "@/components/ui/badge"

export default function CategoriesPage() {
  const { categories, setCategories, addCategory } = useDashboardStore()
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leads, setLeads] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, leadsRes] = await Promise.all([
          getCategories(),
          getUsersByRole("category_lead"),
        ])
        setCategories(categoriesRes.data || [])
        setLeads(leadsRes.data?.data || [])
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [setCategories])

  const handleCreateCategory = async (formData) => {
    try {
      const response = await createCategory(formData)
      addCategory(response.data)
      setIsModalOpen(false)
    } catch (error) {
      console.error("Failed to create category:", error)
    }
  }

  // ... columns and render remain same ...
  const columns = [
    { key: "name", label: "Category Name" },
    { key: "description", label: "Description", render: (value) => <span className="text-muted-foreground">{value || "No description"}</span> },
    { key: "lead", label: "Lead", render: (value) => <Badge variant="secondary" className="font-mono">{value?.name || "Unassigned"}</Badge> },
    { key: "createdAt", label: "Created", render: (value) => <span className="text-sm text-muted-foreground">{new Date(value).toLocaleDateString()}</span> },
  ]

  if (loading) return (/* Loading UI */ <DashboardWrapper title="Categories" requiredRole="admin"><div className="flex items-center justify-center h-96">Loading...</div></DashboardWrapper>)

  return (
    <DashboardWrapper title="Categories" requiredRole="admin">
      <div className="space-y-6">
        {categories.length === 0 ? (
          <EmptyState
            icon={<svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
            title="No categories yet"
            description="Get started by creating your first event category"
            actionLabel="Create Category"
            onAction={() => setIsModalOpen(true)}
          />
        ) : (
          <DataTable
            title="Event Categories"
            columns={columns}
            data={categories}
            searchable
            actions={
              <Button onClick={() => setIsModalOpen(true)} className="glow-primary">
                Create Category
              </Button>
            }
          />
        )}
      </div>
      <CreateCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
        leads={leads}
      />
    </DashboardWrapper>
  )
}