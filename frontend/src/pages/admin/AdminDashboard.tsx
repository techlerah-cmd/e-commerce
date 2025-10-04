import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductsWithStock, getOrders, getCoupons } from "@/lib/adminStore";
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
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    total_sales: 0,
    total_users: 0,
  });
  const { fetchType, fetching, isFetched, makeApiCall } = useAPICall();
  const { authToken } = useAuth();
  const [salesData, setSalesData] = useState();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };
  useEffect(() => {
    fetchData();
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
        setSalesData(response.data.sales_overview);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    format = "number",
  }: {
    title: string;
    value: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    color: string;
    format?: "number" | "currency";
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-primary">
              {format === "currency" ? formatCurrency(value) : value}
            </p>
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
  if (fetching) {
    return <Loading />;
  }
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-serif-elegant text-3xl text-primary">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Overview</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={stats.total_products}
            icon={Package}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Orders"
            value={stats.total_orders}
            icon={ShoppingCart}
            color="bg-green-500"
          />
          <StatCard
            title="Total Sales"
            value={stats.total_sales}
            icon={IndianRupee}
            color="bg-purple-500"
            format="currency"
          />
          <StatCard
            title="Total Users"
            value={stats.total_users}
            icon={Users}
            color="bg-orange-500"
          />
        </div>

        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif-elegant text-xl text-primary">
              Sales Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly sales performance for the current year
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-xs"
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Sales",
                    ]}
                    labelStyle={{ color: "#374151" }}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
