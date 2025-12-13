import { getCategories, getEvents, getUsers } from "@/lib/api";
import { DashboardWrapper } from "@/components/layout/dashboard-wrapper";
import { StatCard } from "@/components/dashboard/stat-card";
import { BarChart } from "@/components/charts/bar-chart";

// This function runs on the SERVER (node_app)
export default async function AdminDashboard() {
  
  let stats = {
    totalUsers: 0,
    totalEvents: 0,
    totalCategories: 0,
    totalRegistrations: 0
  };
  
  let eventGrowthData = [];

  try {
    const [categoriesRes, eventsRes, usersRes] = await Promise.all([
      getCategories(), 
      getEvents(1, 1000),
      getUsers(1, 1000)
    ]);

    // FIX: Access the nested 'data' property correctly based on your Backend Pagination response
    const categoriesData = categoriesRes.data || [];
    console.log("Categories Data:", categoriesData);
    
    // API sends { data: [...], pagination: {...} } -> we need the inner data
    const eventsData = eventsRes.data?.data || []; 
    const usersData = usersRes.data?.users || [];

    stats = {
      totalCategories: categoriesData.length || 0,
      totalEvents: eventsData.length || 0,
      totalUsers: usersData.length || 0,
      totalRegistrations: usersData.length || 0, // Placeholder
    };

    // Chart Data Generation
    const currentMonth = new Date().getMonth();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Simple mock calculation for growth based on real data length
    eventGrowthData = months.slice(0, currentMonth + 1).map((m, i) => ({
        month: m,
        events: i === currentMonth ? stats.totalEvents : Math.floor(Math.random() * 5)
    }));

  } catch (error) {
    console.error("SSR Fetch Error in Admin Dashboard:", error);
  }

  return (
    <DashboardWrapper title="Admin Dashboard" requiredRole="admin">
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            trend="up"
            change={12}
            icon={<span className="text-xl">👥</span>}
            index={0}
          />
          <StatCard
            title="Total Events"
            value={stats.totalEvents}
            trend="up"
            change={5}
            icon={<span className="text-xl">📅</span>}
            index={1}
          />
          <StatCard
            title="Categories"
            value={stats.totalCategories}
            icon={<span className="text-xl">📂</span>}
            index={2}
          />
          <StatCard
            title="Registrations"
            value={stats.totalRegistrations}
            icon={<span className="text-xl">📝</span>}
            index={3}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
           <BarChart
            title="Event Growth"
            data={eventGrowthData}
            dataKey="month"
            valueKey="events"
            color="primary"
          />
        </div>
      </div>
    </DashboardWrapper>
  );
}