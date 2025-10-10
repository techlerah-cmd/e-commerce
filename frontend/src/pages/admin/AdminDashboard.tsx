/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  Users,
  TrendingUp,
} from "lucide-react";
import { useAPICall } from "@/hooks/useApiCall";
import { useAuth } from "@/contexts/AuthContext";
import { API_ENDPOINT } from "@/config/backend";
import { Loading } from "@/components/ui/Loading";

/**
 * AdminDashboard — themed to the deep purple + warm gold design system.
 *
 * Notes:
 * - Uses CSS variables from your theme: --background, --card, --border, --secondary, --accent, --foreground, --muted-foreground, --gradient-accent, --shadow-luxury
 * - Recharts SVG props accept CSS color strings like "hsl(var(--secondary))", so we use those directly.
 */

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    total_sales: 0,
    total_users: 0,
  });
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const { authToken } = useAuth();
  const [salesData, setSalesData] = useState<any[] | undefined>(undefined);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const response = await makeApiCall(
        "GET",
        API_ENDPOINT.ADMIN_DASHBOARD,
        {},
        "application/json",
        authToken,
        "getDashboard"
      );
      if (response.status === 200) {
        setStats({
          total_orders: response.data.total_orders,
          total_products: response.data.total_products,
          total_sales: response.data.total_sales,
          total_users: response.data.total_users,
        });
        setSalesData(response.data.sales_overview || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    bgToken = "--secondary",
    format = "number",
  }: {
    title: string;
    value: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    bgToken?: string; // CSS variable token name (e.g. --accent or --secondary)
    format?: "number" | "currency";
  }) => {
    // Use CSS variables for background; fallback to primary if missing
    const circleStyle = {
      backgroundColor: `hsl(var(${bgToken}))`,
      boxShadow: `0 8px 24px -12px hsla(276 62% 26% / 0.18)`,
    } as React.CSSProperties;

    return (
      <Card className="bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-card hover:shadow-luxury transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
                {title}
              </p>
              <p className="text-2xl font-bold text-[hsl(var(--secondary))]">
                {format === "currency" ? formatCurrency(value) : value}
              </p>
            </div>

            <div
              className="p-3 rounded-full w-12 h-12 flex items-center justify-center"
              style={circleStyle}
            >
              <Icon className="h-6 w-6 text-[hsl(var(--primary))]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <AdminLayout>
      {fetching && !isFetched ? (
        <Loading />
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="font-serif-elegant text-3xl text-[hsl(var(--secondary))]">
              Admin Dashboard
            </h1>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Products"
              value={stats.total_products}
              icon={Package}
              bgToken="--secondary"
            />
            <StatCard
              title="Total Orders"
              value={stats.total_orders}
              icon={ShoppingCart}
              bgToken="--secondary"
            />
            <StatCard
              title="Total Sales"
              value={stats.total_sales}
              icon={IndianRupee}
              bgToken="--secondary"
              format="currency"
            />
            <StatCard
              title="Total Users"
              value={stats.total_users}
              icon={Users}
              bgToken="--secondary"
            />
          </div>

          {/* Sales Chart */}
          <Card className="bg-[hsl(var(--card))] border-[hsl(var(--border))] shadow-card">
            <CardHeader>
              <CardTitle className="font-serif-elegant text-xl text-[hsl(var(--secondary))]">
                Sales Overview
              </CardTitle>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Monthly sales performance for the current year
              </p>
            </CardHeader>

            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData || []}>
                    <CartesianGrid
                      stroke="hsl(var(--border))"
                      strokeOpacity={0.12}
                      strokeDasharray="3 3"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) =>
                        `₹${(value / 1000).toFixed(0)}k`
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatCurrency(value),
                        "Sales",
                      ]}
                      labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        color: "hsl(var(--foreground))",
                        border: `1px solid hsl(var(--border))`,
                        borderRadius: 8,
                        boxShadow: `0 8px 30px -18px hsla(276 62% 26% / 0.32)`,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="hsl(var(--secondary))"
                      fill="hsl(var(--secondary))"
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
