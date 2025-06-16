
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

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
        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{totalSales.toLocaleString()}</div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-black">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts with horizontal scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full overflow-x-auto">
              <div style={{ minWidth: `${Math.max(600, chartData.length * 60)}px`, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#8884d8" 
                      fillOpacity={1} 
                      fill="url(#salesGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="text-black flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-full"></div>
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full overflow-x-auto">
              <div style={{ minWidth: `${Math.max(600, chartData.length * 60)}px`, height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.9}/>
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.4}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#revenueGradient)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
