
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

  const gradientOffset = () => {
    const dataMax = Math.max(...chartData.map((i) => i.sales));
    const dataMin = Math.min(...chartData.map((i) => i.sales));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
          Analytics & Reports
        </h2>
        <div className="flex gap-2">
          {(['hour', 'day', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod(period)}
              className={`capitalize transition-all duration-300 ${
                selectedPeriod === period 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600' 
                  : 'hover:bg-orange-50'
              }`}
            >
              {period}ly
            </Button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-800 text-sm font-medium flex items-center gap-2">
              📈 Total Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{totalSales.toLocaleString()}</div>
            <p className="text-xs text-blue-600 mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-800 text-sm font-medium flex items-center gap-2">
              🛍️ Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-green-600 mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-purple-800 text-sm font-medium flex items-center gap-2">
              💰 Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-purple-600 mt-1">For selected period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              📊 Sales Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-x-auto">
              <div style={{ width: Math.max(600, chartData.length * 40), height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={off} stopColor="#3b82f6" stopOpacity={1} />
                        <stop offset={off} stopColor="#93c5fd" stopOpacity={1} />
                      </linearGradient>
                      <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="url(#splitColor)" 
                      fill="url(#fillGradient)"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white to-gray-50 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-gray-800 flex items-center gap-2">
              💹 Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-x-auto">
              <div style={{ width: Math.max(600, chartData.length * 40), height: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#34d399" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <YAxis 
                      stroke="#6b7280"
                      fontSize={12}
                      tick={{ fill: '#6b7280' }}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="revenue" 
                      fill="url(#barGradient)"
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
