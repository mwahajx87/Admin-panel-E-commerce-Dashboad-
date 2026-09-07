import React, { useState, useMemo } from 'react';
import {
  Package,
  Search,
  Plus,
  Edit2,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldAlert
} from 'lucide-react';
import Pagination from './Pagination';

export default function ProductList({
  products,
  currentUser,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStock, setSelectedStock] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const isAdmin = currentUser?.role === 'Admin';

  const categories = ['All', 'Fashion', 'Home & Living', 'Electronics', 'Groceries'];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStock = selectedStock === 'All' || p.stockStatus === selectedStock;

      return matchesSearch && matchesCat && matchesStock;
    });
  }, [products, searchTerm, selectedCategory, selectedStock]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const getStockBadge = (status, stock) => {
    switch (status) {
      case 'in_stock':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">
            In Stock ({stock})
          </span>
        );
      case 'low_stock':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-700">
            Low Stock ({stock})
          </span>
        );
      case 'out_of_stock':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-100 text-red-700">
            Out of Stock
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">
            Product Inventory
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage merchandise, catalog listings, SKUs, and stock quantities
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
            id="add-product-btn"
            onClick={onAddProduct}
            disabled={!isAdmin}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-sm transition-colors ${
              isAdmin
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60'
            }`}
            title={isAdmin ? 'Add a new product to inventory' : 'Admin privilege required to add products'}
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
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
            id="products-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filter by product name, SKU, or category..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-colors"
          />
        </div>

        {/* Dropdowns for Category & Stock Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Category:</span>
            <select
              id="product-category-filter"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-slate-500">Stock:</span>
            <select
              id="product-stock-filter"
              value={selectedStock}
              onChange={(e) => {
                setSelectedStock(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="All">All Stocks</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100">
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">SKU</th>
                <th className="py-3 px-6">Category</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6">Stock Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium">No products match your criteria</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Try adjusting your search or category filter.
                    </p>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    {/* Product Image & Name */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
                            {product.name}
                          </p>
                          <p className="text-xs text-slate-400 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-6 font-mono text-xs text-slate-600">
                      {product.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-6">
                      <span className="inline-block text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-6 font-semibold text-slate-800">
                      Rs. {product.price.toLocaleString()}
                    </td>

                    {/* Stock Status */}
                    <td className="py-3.5 px-6">
                      {getStockBadge(product.stockStatus, product.stock)}
                    </td>

                    {/* Actions (RBAC: Edit & Delete) */}
                    <td className="py-3.5 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          id={`edit-product-${product.id}-btn`}
                          onClick={() => onEditProduct(product)}
                          disabled={!isAdmin}
                          className={`p-1.5 rounded-md transition-colors ${
                            isAdmin
                              ? 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed opacity-40'
                          }`}
                          title={isAdmin ? 'Edit product' : 'Admin access required to edit'}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          id={`delete-product-${product.id}-btn`}
                          onClick={() => onDeleteProduct(product)}
                          disabled={!isAdmin}
                          className={`p-1.5 rounded-md transition-colors ${
                            isAdmin
                              ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                              : 'text-slate-300 cursor-not-allowed opacity-40'
                          }`}
                          title={isAdmin ? 'Delete product' : 'Admin access required to delete'}
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
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </div>
  );
}
