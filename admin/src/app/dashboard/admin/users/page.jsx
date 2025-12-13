"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { DataTable } from "@/components/dashboard/data-table"
import { useDashboardStore } from "@/store/dashboard-store"
import { getUsers } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function UsersPage() {
  const { users, setUsers } = useDashboardStore()
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUsers(1, 100)
        // FIX: Access response.data.users (The API response structure is nested)
        const userList = response.data?.users || [] 
        setUsers(userList)
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [setUsers])

  const filteredUsers = roleFilter === "all" ? users : users.filter((user) => user.specialRoles?.includes(roleFilter))

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "jnanagniId", label: "ID", render: (value) => <Badge variant="secondary" className="font-mono">{value || "N/A"}</Badge> },
    { key: "role", label: "Primary Role", render: (value) => <Badge variant="outline" className="capitalize">{value}</Badge> },
    {
      key: "specialRoles",
      label: "Special Roles",
      render: (value) =>
        value && value[0] !== "None" ? (
          <div className="flex flex-wrap gap-1">
            {value.map((role, i) => <Badge key={i} className="text-xs capitalize">{role.replace("_", " ")}</Badge>)}
          </div>
        ) : <span className="text-muted-foreground text-sm">None</span>,
    },
    { key: "isVerified", label: "Verified", render: (value) => <Badge variant={value ? "default" : "destructive"} className="text-xs">{value ? "Yes" : "No"}</Badge> },
  ]

  if (loading) return (
    <DashboardWrapper title="Users" requiredRole="admin">
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full"></div>
        </div>
    </DashboardWrapper>
  )

  return (
    <DashboardWrapper title="Users" requiredRole="admin">
      <div className="space-y-6">
        <div className="flex gap-2 flex-wrap">
          <Button variant={roleFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("all")}>All</Button>
          <Button variant={roleFilter === "admin" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("admin")}>Admins</Button>
          <Button variant={roleFilter === "category_lead" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("category_lead")}>Leads</Button>
          <Button variant={roleFilter === "volunteer" ? "default" : "outline"} size="sm" onClick={() => setRoleFilter("volunteer")}>Volunteers</Button>
        </div>
        <DataTable title="User Management" columns={columns} data={filteredUsers} searchable />
      </div>
    </DashboardWrapper>
  )
}