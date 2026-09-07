import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  Eye,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { MONTHLY_SALES_DATA, CATEGORY_BREAKDOWN_DATA } from '../data/mockData';

export default function Dashboard({
  orders,
  products,
  users,
  currentUser,
  onNavigate,
  onOpenCreateOrder,
  onOpenAddProduct,
  onViewOrder
}) {
  // Compute dynamic stats
  const totalRevenue = orders.reduce((acc, order) => {
    return order.status !== 'Cancelled' ? acc + (order.total || 0) : acc;
  }, 1850000); // base + recent orders in PKR

  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const activeUsersCount = users.filter((u) => u.status === 'Active').length;

  const kpis = [
    {
      id: 'kpi-revenue',
      title: 'Total Revenue',
      value: `Rs. ${totalRevenue.toLocaleString()}`,
      change: '+14.8%',
      isPositive: true,
      icon: DollarSign,
      iconBoxClass: 'bg-indigo-50 text-indigo-600'
    },
    {
      id: 'kpi-orders',
      title: 'Total Orders',
      value: totalOrdersCount.toLocaleString(),
      change: '+4.2%',
      isPositive: true,
      icon: ShoppingCart,
      iconBoxClass: 'bg-sky-50 text-sky-600'
    },
    {
      id: 'kpi-users',
      title: 'Active Users',
      value: activeUsersCount.toLocaleString(),
      change: 'Active Now',
      isNeutral: true,
      icon: Users,
      iconBoxClass: 'bg-purple-50 text-purple-600'
    },
    {
      id: 'kpi-products',
      title: 'Total Products',
      value: `${totalProductsCount} Items`,
      change: '-2.1%',
      isPositive: false,
      icon: Package,
      iconBoxClass: 'bg-orange-50 text-orange-600'
    }
  ];

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
            Delivered
          </span>
        );
      case 'Shipped':
      case 'Processing':
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
            {status}
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome with Quick Actions */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Welcome back, {currentUser?.name}
            </h2>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                currentUser?.role === 'Admin'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              {currentUser?.role === 'Admin' ? 'Admin Access' : 'View-Only User'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentUser?.role === 'Admin'
              ? 'Complete administrative permissions enabled to add products, dispatch orders, and manage users.'
              : 'Viewing in read-only mode. Creation, editing, and deletion operations are restricted.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            id="dashboard-quick-add-order-btn"
            onClick={onOpenCreateOrder}
            disabled={currentUser?.role !== 'Admin'}
            className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title={currentUser?.role !== 'Admin' ? 'Admin role required to create orders' : 'Create new order'}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Order</span>
          </button>

          <button
            id="dashboard-quick-add-prod-btn"
            onClick={onOpenAddProduct}
            disabled={currentUser?.role !== 'Admin'}
            className="inline-flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title={currentUser?.role !== 'Admin' ? 'Admin role required to add products' : 'Add new product'}
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid - Geometric Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              id={kpi.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg ${kpi.iconBoxClass}`}>
                  <Icon className="w-[18px] h-[18px]" />
                </div>
                {kpi.isNeutral ? (
                  <span className="text-xs font-medium text-slate-400">
                    {kpi.change}
                  </span>
                ) : kpi.isPositive ? (
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
                    {kpi.change}
                    <ArrowUpRight className="w-3 h-3" />
                  </span>
                ) : (
                  <span className="text-xs font-medium text-red-600 flex items-center gap-0.5">
                    {kpi.change}
                    <ArrowUpRight className="w-3 h-3 rotate-90" />
                  </span>
                )}
              </div>

              <div className="text-slate-500 text-xs font-medium">{kpi.title}</div>
              <div className="text-2xl font-bold mt-1 text-slate-800">{kpi.value}</div>
            </div>
          );
        })}
      </div>

      {/* Charts Section: Revenue Analytics & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Analytics (Line/Area Chart) - 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex flex-col shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Revenue Growth</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Monthly sales performance and trend trajectory
              </p>
            </div>
            <select className="text-xs border border-slate-200 rounded-md bg-slate-50 text-slate-600 px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_SALES_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94A3B8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `Rs. ${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => [`Rs. ${Number(value).toLocaleString()}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#818CF8' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4F46E5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown (Pie / Donut Chart) - 1 col */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <h3 className="font-bold text-slate-800 text-base mb-4">Category Breakdown</h3>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CATEGORY_BREAKDOWN_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {CATEGORY_BREAKDOWN_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name) => [`${val}% of total`, name]}
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center stat */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-slate-400 uppercase font-medium">Total</span>
              <span className="text-sm font-bold text-slate-800">100%</span>
            </div>
          </div>

          {/* Geometric legend list matching the design */}
          <div className="mt-4 space-y-2 pt-3 border-t border-slate-100">
            {CATEGORY_BREAKDOWN_DATA.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: cat.color }}
                  ></div>
                  <span>{cat.name}</span>
                </div>
                <span className="font-semibold text-slate-800">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-base">Recent Orders</h3>
          <button
            id="dashboard-view-all-orders-btn"
            onClick={() => onNavigate('orders')}
            className="text-indigo-600 text-xs font-semibold hover:underline cursor-pointer"
          >
            View All Orders
          </button>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold">
              <tr>
                <th className="px-6 py-3 border-b border-slate-100">Order ID</th>
                <th className="px-6 py-3 border-b border-slate-100">Customer</th>
                <th className="px-6 py-3 border-b border-slate-100">Status</th>
                <th className="px-6 py-3 border-b border-slate-100">Date</th>
                <th className="px-6 py-3 border-b border-slate-100 text-right">Total</th>
                <th className="px-6 py-3 border-b border-slate-100 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5 border-b border-slate-50 font-mono text-xs font-semibold text-indigo-600">
                    {order.id}
                  </td>
                  <td className="px-6 py-3.5 border-b border-slate-50">
                    <p className="font-medium text-slate-900">{order.customerName}</p>
                    <p className="text-xs text-slate-400 truncate">{order.customerEmail}</p>
                  </td>
                  <td className="px-6 py-3.5 border-b border-slate-50">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-3.5 border-b border-slate-50 text-xs text-slate-500">
                    {order.date}
                  </td>
                  <td className="px-6 py-3.5 border-b border-slate-50 text-right font-semibold text-slate-800">
                    Rs. {order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 border-b border-slate-50 text-right">
                    <button
                      id={`dashboard-view-order-${order.id}-btn`}
                      onClick={() => onViewOrder(order)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
