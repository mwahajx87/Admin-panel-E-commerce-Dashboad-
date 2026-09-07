import React, { useState, useEffect } from 'react';
import { X, Package, DollarSign, Layers, Hash, Image as ImageIcon, FileText } from 'lucide-react';

export default function AddProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Fashion');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const categories = ['Fashion', 'Home & Living', 'Electronics', 'Groceries'];

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name || '');
      setSku(editingProduct.sku || '');
      setCategory(editingProduct.category || 'Fashion');
      setPrice(editingProduct.price ? String(editingProduct.price) : '');
      setStock(editingProduct.stock !== undefined ? String(editingProduct.stock) : '');
      setImage(editingProduct.image || '');
      setDescription(editingProduct.description || '');
      setError('');
    } else {
      // Default new product values
      setName('');
      setSku(`PK-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategory('Fashion');
      setPrice('');
      setStock('');
      setImage('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=150&auto=format&fit=crop&q=80');
      setDescription('');
      setError('');
    }
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a product title.');
      return;
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please enter a valid price greater than Rs. 0.');
      return;
    }
    const numStock = parseInt(stock, 10);
    if (isNaN(numStock) || numStock < 0) {
      setError('Please enter a valid non-negative stock quantity.');
      return;
    }

    let stockStatus = 'in_stock';
    if (numStock === 0) stockStatus = 'out_of_stock';
    else if (numStock <= 10) stockStatus = 'low_stock';

    const productData = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: name.trim(),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category,
      price: numPrice,
      stock: numStock,
      stockStatus,
      image: image.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&auto=format&fit=crop&q=80',
      description: description.trim()
    };

    onSave(productData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-xs text-slate-500">
                {editingProduct ? 'Update product specifications and pricing' : 'Create a new item in your inventory catalog'}
              </p>
            </div>
          </div>
          <button
            id="close-product-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="product-name-input">
              Product Title *
            </label>
            <input
              id="product-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Wireless Noise-Canceling Headphones"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Category & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="product-category-input">
                Category
              </label>
              <select
                id="product-category-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="product-sku-input">
                SKU Identifier
              </label>
              <input
                id="product-sku-input"
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="AUD-NC-700"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="product-price-input">
                Price (PKR / Rs.) *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-semibold text-[11px]">
                  Rs.
                </span>
                <input
                  id="product-price-input"
                  type="number"
                  step="1"
                  min="1"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="4500"
                  className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="product-stock-input">
                Initial Stock Count *
              </label>
              <input
                id="product-stock-input"
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="25"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="product-image-input">
              Image URL
            </label>
            <input
              id="product-image-input"
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="product-desc-input">
              Description (Optional)
            </label>
            <textarea
              id="product-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key features, specifications, or packaging details..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              id="cancel-product-modal-btn"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="submit-product-modal-btn"
              className="px-4 py-2 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors cursor-pointer"
            >
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
