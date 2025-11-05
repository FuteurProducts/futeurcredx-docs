import { DashboardLayout } from "@/components/dashboard/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Activity, Clock, Calendar } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Analytics = () => {
  // Sample data for charts
  const userGrowthData = [
    { month: "Jan", users: 400, active: 240 },
    { month: "Feb", users: 600, active: 380 },
    { month: "Mar", users: 800, active: 500 },
    { month: "Apr", users: 1200, active: 780 },
    { month: "May", users: 1800, active: 1100 },
    { month: "Jun", users: 2350, active: 1450 },
  ];

  const apiCallsData = [
    { day: "Mon", calls: 3400 },
    { day: "Tue", calls: 4200 },
    { day: "Wed", calls: 3800 },
    { day: "Thu", calls: 5100 },
    { day: "Fri", calls: 4800 },
    { day: "Sat", calls: 2900 },
    { day: "Sun", calls: 2200 },
  ];

  const stats = [
    {
      title: "Total API Calls",
      value: "26,500",
      change: "+12.5%",
      changeType: "positive",
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Sessions",
      value: "1,450",
      change: "+8.2%",
      changeType: "positive",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Avg Response Time",
      value: "245ms",
      change: "-15.3%",
      changeType: "positive",
      icon: Clock,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Error Rate",
      value: "0.8%",
      change: "-0.3%",
      changeType: "positive",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-slate-500 mt-1">
            Detailed insights into your application performance and user behavior
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Growth Chart */}
          <Card className="p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">User Growth</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  name="Total Users"
                />
                <Line
                  type="monotone"
                  dataKey="active"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Active Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* API Calls Chart */}
          <Card className="p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">API Calls This Week</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={apiCallsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="calls" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {[
              { action: "New user registered", time: "2 minutes ago", type: "success" },
              { action: "API rate limit reached", time: "15 minutes ago", type: "warning" },
              { action: "System update completed", time: "1 hour ago", type: "info" },
              { action: "Database backup completed", time: "2 hours ago", type: "success" },
              { action: "New feature deployed", time: "3 hours ago", type: "info" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === "success" ? "bg-green-500" :
                    activity.type === "warning" ? "bg-orange-500" :
                    "bg-blue-500"
                  }`} />
                  <span className="font-medium">{activity.action}</span>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
