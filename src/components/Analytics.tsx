
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const Analytics = () => {
  const { getAnalytics } = useProducts();
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'month' | 'year'>('day');

  const data = getAnalytics(selectedPeriod);
  
  const formatData = () => {
    return data.map(item => ({
      time: selectedPeriod === 'hour' ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
            selectedPeriod === 'day' ? item.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }) :
            selectedPeriod === 'month' ? item.timestamp.toLocaleDateString([], { month: 'short', year: 'numeric' }) :
            item.timestamp.getFullYear().toString(),
      sales: item.sales,
      orders: item.orders,
      revenue: item.revenue
    }));
  };

  const chartData = formatData();
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-black">Analytics & Reports</h2>
        <div className="flex gap-2">
          {(['hour', 'day', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period)}
              className="capitalize"
            >
              {period}ly
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-morphism border-gray-200/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-sm font-medium">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalSales.toLocaleString()}</div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-morphism border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-black">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50">
          <CardHeader>
            <CardTitle className="text-black">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
