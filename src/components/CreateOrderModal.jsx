import React, { useState, useMemo } from 'react';
import {
  X,
  ShoppingCart,
  Plus,
  Trash2,
  User,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function CreateOrderModal({ isOpen, onClose, products, onSubmitOrder }) {
  // Customer details state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery (COD)');

  // Dynamic Line items state
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [lineItems, setLineItems] = useState([]);
  const [error, setError] = useState('');

  // Selected product object from catalog
  const currentProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Real-Time Calculations in PKR
  const subtotal = useMemo(() => {
    return lineItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [lineItems]);

  const tax = useMemo(() => {
    return Math.round(subtotal * 0.05); // 5% GST
  }, [subtotal]);

  const shipping = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal >= 5000 ? 0 : 250; // Free delivery over Rs. 5,000, else Rs. 250
  }, [subtotal]);

  const grandTotal = useMemo(() => {
    return subtotal + tax + shipping;
  }, [subtotal, tax, shipping]);

  if (!isOpen) return null;

  // Add line item handler
  const handleAddLineItem = () => {
    if (!currentProduct) return;
    setError('');

    if (itemQuantity <= 0) {
      setError('Please choose a quantity of at least 1.');
      return;
    }

    if (currentProduct.stockStatus === 'out_of_stock') {
      setError(`Cannot add ${currentProduct.name} - product is out of stock.`);
      return;
    }

    // Check if item already exists in lineItems
    const existingIndex = lineItems.findIndex((item) => item.productId === currentProduct.id);
    if (existingIndex > -1) {
      const updated = [...lineItems];
      const newQty = updated[existingIndex].quantity + itemQuantity;
      updated[existingIndex].quantity = newQty;
      setLineItems(updated);
    } else {
      setLineItems([
        ...lineItems,
        {
          productId: currentProduct.id,
          productName: currentProduct.name,
          price: currentProduct.price,
          quantity: itemQuantity,
          image: currentProduct.image
        }
      ]);
    }

    // Reset quantity
    setItemQuantity(1);
  };

  const handleRemoveLineItem = (productId) => {
    setLineItems(lineItems.filter((i) => i.productId !== productId));
  };

  const handleUpdateQuantity = (productId, delta) => {
    setLineItems(
      lineItems
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      setError('Please add at least one product to the order.');
      return;
    }

    const newOrder = {
      id: `ORD-PK-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      customerEmail,
      customerAddress,
      date: new Date().toISOString().split('T')[0],
      items: lineItems,
      subtotal,
      tax,
      shipping,
      total: grandTotal,
      paymentMethod,
      status: 'Pending'
    };

    onSubmitOrder(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Create New Order</h3>
              <p className="text-xs text-slate-400">Add customer details and items</p>
            </div>
          </div>
          <button
            id="close-create-order-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Scrollable Content */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 " />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Customer Details */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>1. Customer & Shipping Details (Pakistan)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="order-customer-name">
                  Customer Name *
                </label>
                <input
                  id="order-customer-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Fatima Zahra"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="order-customer-email">
                  Customer Email *
                </label>
                <input
                  id="order-customer-email"
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. fatima.zahra@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="order-shipping-address">
                  Delivery Address *
                </label>
                <input
                  id="order-shipping-address"
                  type="text"
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="e.g. House 82, Sector Y, Phase 3, DHA, Lahore"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="order-payment-method">
                  Payment Method
                </label>
                <select
                  id="order-payment-method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                  <option value="JazzCash">JazzCash</option>
                  <option value="EasyPaisa">EasyPaisa</option>
                  <option value="Raast / Bank Transfer">Raast / Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Item Selection & Dynamic Line Items */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-indigo-600" />
              <span>2. Product Selection & Line Items</span>
            </h4>

            {/* Selector Bar */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 sm:space-y-0 sm:flex sm:items-end sm:gap-3">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Catalog Product
                </label>
                <select
                  id="order-select-product-dropdown"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id} disabled={p.stockStatus === 'out_of_stock'}>
                      {p.name} — Rs. {p.price.toLocaleString()}{' '}
                      {p.stockStatus === 'out_of_stock'
                        ? '(Out of Stock)'
                        : `(${p.stock} in stock)`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity Selector */}
              <div className="w-28">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
                    className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full text-center text-xs font-semibold text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setItemQuantity(itemQuantity + 1)}
                    className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic Add Item Button */}
              <button
                type="button"
                id="order-add-item-btn"
                onClick={handleAddLineItem}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </button>
            </div>

            {/* Line Items List */}
            <div className="mt-4">
              {lineItems.length === 0 ? (
                <div className="py-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <p className="text-xs font-medium text-slate-400">
                    No products added to this order yet. Select an item above and click "Add Item".
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {lineItems.map((item) => (
                    <div
                      key={item.productId}
                      className="p-3 bg-white flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.productName}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate">
                            {item.productName}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Rs. {item.price.toLocaleString()} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        {/* Quantity adjust buttons */}
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.productId, -1)}
                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2.5 py-1 font-semibold text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(item.productId, 1)}
                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Item line total */}
                        <span className="text-xs font-semibold text-slate-800 w-24 text-right">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </span>

                        {/* Remove item button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(item.productId)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Real-Time Order Summary */}
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3">
              3. Real-Time Order Summary
            </h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({lineItems.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-800">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span className="font-semibold text-slate-800">Rs. {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges {subtotal >= 5000 ? '(Free over Rs. 5,000)' : ''}</span>
                <span className="font-semibold text-slate-800">
                  {shipping === 0 ? 'FREE' : `Rs. ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-800">Total Amount</span>
                <span className="font-bold text-indigo-600 text-base">
                  Rs. {grandTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              id="cancel-create-order-btn"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-create-order-btn"
              disabled={lineItems.length === 0}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-colors cursor-pointer"
            >
              Submit Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
