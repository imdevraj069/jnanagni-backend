"use client"

import { useEffect, useState } from "react"
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper"
import { StatCard } from "@/components/dashboard/stat-card"
import { BarChart } from "@/components/charts/bar-chart"
import { LineChart } from "@/components/charts/line-chart"
import { PieChart } from "@/components/charts/pie-chart"
import { useDashboardStore } from "@/store/dashboard-store"
import { getCategories, getEvents, getUsers } from "@/lib/api" // FIX: Named imports

export default function AnalyticsPage() {
  const { stats, setStats } = useDashboardStore()
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({
    eventGrowth: [],
    registrationTrend: [],
    userRoles: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // FIX: Remove 'api.' prefix
        const [categoriesRes, eventsRes, usersRes] = await Promise.all([
            getCategories(), 
            getEvents(1, 1000), 
            getUsers(1, 1000)
        ])

        const categories = categoriesRes.data || [];
        const events = eventsRes.data?.data || [];
        const users = usersRes.data?.data?.users || [];

        setStats({
          totalCategories: categories.length,
          totalEvents: events.length,
          totalUsers: users.length,
          totalRegistrations: users.length, 
        })

        // ... rest of logic remains same ...
        const roleCounts = users.reduce((acc, user) => {
          const role = user.specialRoles?.[0] || "None"
          acc[role] = (acc[role] || 0) + 1
          return acc
        }, {})

        const userRolesData = Object.entries(roleCounts).map(([name, count]) => ({
          name: name.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          count,
        }))

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonth = new Date().getMonth();

        const groupByMonth = (items) => {
            const counts = new Array(12).fill(0);
            items.forEach(item => {
              const d = new Date(item.createdAt);
              if (!isNaN(d)) counts[d.getMonth()]++;
            });
            return counts;
        };

        const eventMonthly = groupByMonth(events);
        const userMonthly = groupByMonth(users);

        const eventGrowth = months.slice(0, currentMonth + 1).map((m, i) => ({
            month: m,
            events: eventMonthly[i]
        }));

        const registrationTrend = months.slice(0, currentMonth + 1).map((m, i) => ({
            month: m,
            registrations: userMonthly[i]
        }));

        setChartData({
          eventGrowth,
          registrationTrend,
          userRoles: userRolesData.length > 0 ? userRolesData : [{ name: "No Users", count: 0 }],
        })
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [setStats])

  if (loading) {
    return (
      <DashboardWrapper title="Analytics" requiredRole="admin">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-4 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </DashboardWrapper>
    )
  }

  return (
    <DashboardWrapper title="Analytics" requiredRole="admin">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            icon={<svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
          />
          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon={<svg className="h-6 w-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>}
          />
          <StatCard
            title="Est. Registrations"
            value={stats.totalRegistrations}
            icon={<svg className="h-6 w-6 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <BarChart title="Event Growth (By Month)" data={chartData.eventGrowth} dataKey="month" valueKey="events" color="primary" />
          <LineChart title="Registration Trend (By Month)" data={chartData.registrationTrend} dataKey="month" valueKey="registrations" color="accent" />
        </div>

        <div className="grid gap-6">
          <PieChart title="Users by Special Role" data={chartData.userRoles} dataKey="name" valueKey="count" />
        </div>
      </div>
    </DashboardWrapper>
  )
}