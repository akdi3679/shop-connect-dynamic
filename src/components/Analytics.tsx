
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

export const Analytics = () => {
  const { getAnalytics } = useProducts();
  const [selectedPeriod, setSelectedPeriod] = useState<'hour' | 'day' | 'month' | 'year'>('day');
  const [chartType, setChartType] = useState<'sales' | 'revenue'>('sales');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const data = getAnalytics(selectedPeriod);
  
  const formatData = () => {
    return data.map((item, index) => ({
      time: selectedPeriod === 'hour' ? item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
            selectedPeriod === 'day' ? item.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' }) :
            selectedPeriod === 'month' ? item.timestamp.toLocaleDateString([], { month: 'short', year: 'numeric' }) :
            item.timestamp.getFullYear().toString(),
      sales: item.sales,
      orders: item.orders,
      revenue: item.revenue,
      index: index
    }));
  };

  const chartData = formatData();
  const totalSales = data.reduce((sum, item) => sum + item.sales, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  // Pagination for horizontal scroll
  const totalPages = Math.ceil(chartData.length / itemsPerPage);
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = chartData.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-white/30">
          <p className="font-medium text-black">{`${label}`}</p>
          <p className="text-sm">
            <span className="font-medium text-blue-600">
              {chartType === 'sales' ? 'Sales: ' : 'Revenue: $'}
            </span>
            <span className="text-black">
              {chartType === 'sales' ? payload[0].value : payload[0].value.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-black">Analytics & Reports</h2>
        <div className="flex gap-2">
          {(['hour', 'day', 'month', 'year'] as const).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              onClick={() => {
                setSelectedPeriod(period);
                setCurrentPage(0); // Reset pagination when changing period
              }}
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

      {/* Single Professional Chart */}
      <Card className="glass-morphism border-gray-200/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-black text-xl">
              {chartType === 'sales' ? 'Sales Analytics' : 'Revenue Analytics'}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={chartType === 'sales' ? 'default' : 'outline'}
                onClick={() => setChartType('sales')}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Sales
              </Button>
              <Button
                variant={chartType === 'revenue' ? 'default' : 'outline'}
                onClick={() => setChartType('revenue')}
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Revenue
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={paginatedData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartType === 'sales' ? "#3B82F6" : "#10B981"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartType === 'sales' ? "#3B82F6" : "#10B981"} stopOpacity={0.05}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => chartType === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString()}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey={chartType} 
                  stroke={chartType === 'sales' ? "#3B82F6" : "#10B981"}
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  dot={{ fill: chartType === 'sales' ? "#3B82F6" : "#10B981", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: chartType === 'sales' ? "#3B82F6" : "#10B981", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <span className="text-xs text-gray-500">
                  ({startIndex + 1}-{Math.min(endIndex, chartData.length)} of {chartData.length} entries)
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
