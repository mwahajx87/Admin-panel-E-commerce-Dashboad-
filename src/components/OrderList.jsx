import React, { useState, useMemo } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ShieldAlert,
  Calendar,
  DollarSign
} from 'lucide-react';
import Pagination from './Pagination';

export default function OrderList({
  orders,
  currentUser,
  onOpenCreateOrder,
  onViewOrder,
  onUpdateStatus,
  onDeleteOrder
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isAdmin = currentUser?.role === 'Admin';

  const statuses = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];
  const paymentMethods = [
    'All',
    'JazzCash',
    'EasyPaisa',
    'Cash on Delivery (COD)',
    'Raast / Bank Transfer'
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || order.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage, itemsPerPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
            Delivered
          </span>
        );
      case 'Shipped':
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
            Shipped
          </span>
        );
      case 'Pending':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
            Pending
          </span>
        );
      case 'Cancelled':
        return (
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Create Order Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Customer Orders
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track transactions, verify fulfillment statuses, and manage customer orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isAdmin && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
              <ShieldAlert className="w-3.5 h-3.5" />
              View-Only Mode
            </span>
          )}
          <button
            id="order-list-create-btn"
            onClick={onOpenCreateOrder}
            disabled={!isAdmin}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors ${
              isAdmin
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
            title={isAdmin ? 'Create and dispatch a new order' : 'Admin privilege required to create orders'}
          >
            <Plus className="w-4 h-4" />
            <span>Create Order</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="orders-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by order ID (ORD-...) or customer name..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Dropdowns for Status & Payment Method */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Status:</span>
            <select
              id="order-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {statuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Payment:</span>
            <select
              id="order-payment-filter"
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {paymentMethods.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer Name</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Payment Method</th>
                <th className="px-6 py-3">Order Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">No orders match your filter criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Clear search filters or create a new order above.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                    {/* Order ID */}
                    <td className="px-6 py-3.5 font-semibold font-mono text-xs text-indigo-600">
                      {order.id}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-3.5">
                      <p className="font-semibold text-slate-800">{order.customerName}</p>
                      <p className="text-xs text-slate-400 truncate max-w-xs">
                        {order.customerEmail}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-3.5 text-xs text-slate-500">
                      {order.date}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-3.5 font-semibold text-slate-800">
                      Rs. {order.total.toLocaleString()}
                      <span className="block text-[10px] font-normal text-slate-400">
                        {order.items?.length || 1} {order.items?.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>

                    {/* Payment Method */}
                    <td className="px-6 py-3.5 text-xs text-slate-600">
                      {order.paymentMethod}
                    </td>

                    {/* Order Status */}
                    <td className="px-6 py-3.5">
                      {getStatusBadge(order.status)}
                    </td>

                    {/* Actions: View Details, Status change, & Delete */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {/* Status dropdown (Admin only) */}
                        <div className="relative">
                          <select
                            id={`change-status-${order.id}`}
                            value={order.status}
                            onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                            disabled={!isAdmin}
                            className={`px-2 py-1 text-xs font-medium rounded-md border transition-colors ${
                              isAdmin
                                ? 'bg-white border-slate-200 text-slate-700 hover:border-indigo-400 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500'
                                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                            }`}
                            title={isAdmin ? 'Change order status' : 'Admin privilege required to update status'}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* View Details Button */}
                        <button
                          id={`view-order-${order.id}-btn`}
                          onClick={() => onViewOrder(order)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="View Order Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Delete Order Button */}
                        <button
                          id={`delete-order-${order.id}-btn`}
                          onClick={() => onDeleteOrder && onDeleteOrder(order)}
                          disabled={!isAdmin}
                          className={`p-1.5 rounded-md transition-colors ${
                            isAdmin
                              ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed opacity-40'
                          }`}
                          title={isAdmin ? 'Delete order' : 'Admin access required to delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredOrders.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
