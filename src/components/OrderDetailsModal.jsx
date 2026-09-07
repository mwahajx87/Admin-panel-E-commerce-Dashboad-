import React from 'react';
import {
  X,
  ShoppingCart,
  User,
  MapPin,
  CreditCard,
  Calendar,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle
} from 'lucide-react';

export default function OrderDetailsModal({ isOpen, onClose, order, onUpdateStatus, isAdmin }) {
  if (!isOpen || !order) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-800">
                  Order Details: {order.id}
                </h3>
                {getStatusBadge(order.status)}
              </div>
              <p className="text-xs text-slate-500">
                Placed on {order.date} via {order.paymentMethod}
              </p>
            </div>
          </div>
          <button
            id="close-order-details-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Customer & Shipping Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-500" />
                Customer
              </p>
              <p className="font-semibold text-slate-800 text-sm">{order.customerName}</p>
              <p className="text-slate-600">{order.customerEmail}</p>
            </div>

            <div>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Shipping Destination
              </p>
              <p className="text-slate-700 font-medium">{order.customerAddress}</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              Itemized Products ({order.items?.length || 0})
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {order.items?.map((item, index) => (
                <div key={index} className="p-3 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-800">{item.productName}</p>
                      <p className="text-slate-500">
                        Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="font-semibold text-slate-800">
                    Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-800">
                Rs. {(order.subtotal || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST / Taxes</span>
              <span className="font-semibold text-slate-800">
                Rs. {(order.tax || 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Fee</span>
              <span className="font-semibold text-slate-800">
                {order.shipping === 0 ? 'FREE' : `Rs. ${(order.shipping || 0).toLocaleString()}`}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-800">Total Charged</span>
              <span className="font-bold text-indigo-600 text-base">
                Rs. {(order.total || 0).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Status Changer (Admin Only) */}
          {isAdmin && (
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                Update Order Status:
              </span>
              <select
                id="order-details-status-changer"
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3 border-t border-slate-200 bg-slate-50">
          <button
            id="order-details-close-btn"
            onClick={onClose}
            className="px-3.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
