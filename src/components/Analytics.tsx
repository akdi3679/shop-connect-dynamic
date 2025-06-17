
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProducts } from '@/contexts/ProductContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, defs, linearGradient, stop } from 'recharts';

const CurrencyIcon = ({ className = "w-6 h-6", color = "#0F0F0F" }: { className?: string; color?: string }) => (
  <svg width="2.5em" height="2.5em" viewBox="0 0 100 100" style={{ verticalAlign: 'middle', display: 'inline-block' }} className={className}>
    <text x="70" y="80" fontSize="80" fontFamily="Amiri, serif" direction="rtl"
          fill={color} stroke={color} strokeWidth="1" paintOrder="stroke">&#x062F;</text>
    <text x="47" y="39" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 45,39)"
          fill={color} stroke={color} strokeWidth="1.5" paintOrder="stroke">ا</text>
    <text x="47" y="47" fontSize="50" fontFamily="Amiri, serif" transform="rotate(90 45,47)"
          fill={color} stroke={color} strokeWidth="1.5" paintOrder="stroke">ا</text>
  </svg>
);

const PremiumQualityIcon = () => (
  <svg width="32" height="32" viewBox="2 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }} className="h-6 w-6">
    <path d="M8.97059 0.11779C9.4579 0.377681 9.64225 0.983393 9.38235 1.47069L6.42375 7.0179C6.46754 7.02162 6.51126 7.02592 6.55491 7.0308L11.2929 2.29297C11.6834 1.90245 12.3166 1.90245 12.7071 2.29297C13.0976 2.68348 13.0976 3.31662 12.7071 3.70713L8.65259 7.76152C8.71445 7.80024 8.77559 7.84038 8.83593 7.88194C9.56438 8.38359 10.1416 9.06578 10.5162 9.85418C10.7532 10.353 10.4124 10.9035 9.87637 11.0367C9.34038 11.1699 8.80456 10.8292 8.50275 10.3667C8.29171 10.0433 8.01827 9.7612 7.695 9.53858C7.09429 9.1249 6.36301 8.94518 5.63896 9.0333C4.91492 9.12141 4.2481 9.47127 3.76414 10.017C3.28018 10.5626 3.01251 11.2665 3.01156 11.9958C3.0106 12.7252 3.27643 13.4297 3.75896 13.9767C4.24149 14.5236 4.90739 14.8753 5.63121 14.9653C6.35502 15.0553 7.08676 14.8775 7.68856 14.4654C8.0124 14.2436 8.28658 13.9622 8.49847 13.6394C8.80149 13.1776 9.3382 12.8384 9.87384 12.9729C10.4095 13.1075 10.7489 13.6589 10.5106 14.1571C10.1339 14.9446 9.55491 15.6252 8.82515 16.125C7.81827 16.8145 6.59399 17.112 5.38297 16.9614C4.17195 16.8108 3.05781 16.2225 2.25049 15.3074C1.44461 14.3939 1 13.2177 1 11.9998L1 11.9932C1.00021 11.834 1.00801 11.6756 1.02322 11.5183C1.0714 10.9582 1.18967 10.265 1.33192 9.55372C1.52382 8.59422 1.77804 7.51464 2.02986 6.5074C2.28209 5.49852 2.53402 4.55385 2.72274 3.8619C2.81715 3.51572 2.89588 3.23229 2.9511 3.03511C2.97998 2.93195 3.00908 2.82885 3.03834 2.7258C3.19007 2.19478 3.74369 1.88684 4.27472 2.03856C4.80576 2.19028 5.11325 2.74374 4.96152 3.27476C4.93318 3.37457 4.905 3.47443 4.87703 3.57435C4.82286 3.76778 4.74535 4.04683 4.65226 4.38812C4.46598 5.07113 4.21791 6.0014 3.97014 6.99246C3.92924 7.15607 3.8884 7.32111 3.8479 7.48676C3.87401 7.47431 3.90024 7.46208 3.92657 7.45008L7.61765 0.529542C7.87755 0.0422476 8.53379 -0.115212 8.97059 0.11779Z" fill="#0F0F0F"/>
  </svg>
);

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
              Total Sales
              <PremiumQualityIcon />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalSales.toLocaleString()}</div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-black text-sm font-medium flex items-center gap-2">
              Total Revenue
              <CurrencyIcon className="w-8 h-8" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-black flex items-center gap-2">
              <CurrencyIcon className="w-10 h-10" />
              {totalRevenue.toLocaleString()}
            </div>
            <p className="text-xs text-black/60 mt-1">For selected period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts with horizontal scroll */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader>
            <CardTitle className="text-black">Sales Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-x-auto">
              <div style={{ minWidth: Math.max(800, chartData.length * 50) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6B7280"
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      fill="url(#salesGradient)"
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-gray-200/50 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="text-black">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 overflow-x-auto">
              <div style={{ minWidth: Math.max(800, chartData.length * 50) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#6B7280"
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <YAxis 
                      stroke="#6B7280"
                      fontSize={12}
                      tick={{ fill: '#6B7280' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
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
