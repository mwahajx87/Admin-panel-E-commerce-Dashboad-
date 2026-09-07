import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import AddProductModal from "./components/AddProductModal";
import OrderList from "./components/OrderList";
import CreateOrderModal from "./components/CreateOrderModal";
import OrderDetailsModal from "./components/OrderDetailsModal";
import UserList from "./components/UserList";
import EditUserModal from "./components/EditUserModal";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_USERS,
} from "./data/mockData";
import { CheckCircle2 } from "lucide-react";

export default function App() {
  // Authentication state (Pakistani Admin profile)
  const [currentUser, setCurrentUser] = useState({
    email: "wahajwahaj200@gmail.com",
    name: "Wahaj Ahmed",
    role: "Admin",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  });

  // Navigation state
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'orders' | 'products' | 'users'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");

  // Core Data State (shared across all modules)
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [users, setUsers] = useState(INITIAL_USERS);

  // Modals state
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Workable Delete Target Modal State
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast feedback message state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Auth actions
  const handleLogin = (userObj) => {
    setCurrentUser(userObj);
    setActiveTab("dashboard");
    showToast(`Welcome back, ${userObj.name}! Logged in as ${userObj.role}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab("dashboard");
  };

  // Order Handlers
  const handleCreateOrder = (newOrder) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Automatically decrement product inventory
    setProducts((prev) =>
      prev.map((prod) => {
        const lineItem = newOrder.items.find(
          (item) => item.productId === prod.id,
        );
        if (lineItem) {
          const newStock = Math.max(0, prod.stock - lineItem.quantity);
          let newStatus = "in_stock";
          if (newStock === 0) newStatus = "out_of_stock";
          else if (newStock <= 10) newStatus = "low_stock";
          return {
            ...prod,
            stock: newStock,
            stockStatus: newStatus,
          };
        }
        return prod;
      }),
    );

    showToast(`Order ${newOrder.id} successfully created and dispatched!`);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    if (viewingOrder && viewingOrder.id === orderId) {
      setViewingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    showToast(`Order status updated to "${newStatus}"`);
  };

  // Product Handlers
  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === productData.id ? productData : p)),
      );
      showToast(`Product "${productData.name}" updated successfully.`);
    } else {
      setProducts((prev) => [productData, ...prev]);
      showToast(`New product "${productData.name}" added to catalog.`);
    }
    setEditingProduct(null);
  };

  // User Handlers
  const handleSaveUser = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
    );
    showToast(`User account "${updatedUser.name}" updated.`);
    setEditingUser(null);
  };

  // Workable Delete Requests
  const handleRequestDeleteProduct = (product) => {
    const prod =
      typeof product === "object"
        ? product
        : products.find((p) => p.id === product);
    if (!prod) return;
    setDeleteTarget({
      type: "product",
      id: prod.id,
      name: prod.name,
      itemType: "product",
      title: "Delete Product",
    });
  };

  const handleRequestDeleteOrder = (order) => {
    const ord =
      typeof order === "object" ? order : orders.find((o) => o.id === order);
    if (!ord) return;
    setDeleteTarget({
      type: "order",
      id: ord.id,
      name: `Order #${ord.id} (${ord.customerName})`,
      itemType: "order",
      title: "Delete Order Record",
    });
  };

  const handleRequestDeleteUser = (user) => {
    const usr =
      typeof user === "object" ? user : users.find((u) => u.id === user);
    if (!usr) return;
    setDeleteTarget({
      type: "user",
      id: usr.id,
      name: `${usr.name} (${usr.email})`,
      itemType: "user account",
      title: "Delete User Account",
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { type, id, name } = deleteTarget;

    if (type === "product") {
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast(`Product "${name}" permanently removed.`);
    } else if (type === "order") {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      showToast(`${name} permanently removed.`);
    } else if (type === "user") {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      showToast(`User account "${name}" permanently removed.`);
    }

    setDeleteTarget(null);
  };

  // If user is not authenticated, show LoginPage
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Collapsible / Responsive Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        counts={{
          orders: orders.length,
          products: products.length,
          users: users.length,
        }}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        mobileOpen={isMobileMenuOpen}
        setMobileOpen={setIsMobileMenuOpen}
      />

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          setMobileOpen={setIsMobileMenuOpen}
          activeTab={activeTab}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <Dashboard
              orders={orders}
              products={products}
              users={users}
              currentUser={currentUser}
              onNavigate={setActiveTab}
              onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
              onOpenAddProduct={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onViewOrder={(order) => setViewingOrder(order)}
            />
          )}

          {activeTab === "products" && (
            <ProductList
              products={products}
              currentUser={currentUser}
              onAddProduct={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onEditProduct={(product) => {
                setEditingProduct(product);
                setIsProductModalOpen(true);
              }}
              onDeleteProduct={handleRequestDeleteProduct}
            />
          )}

          {activeTab === "orders" && (
            <OrderList
              orders={orders}
              currentUser={currentUser}
              onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
              onViewOrder={(order) => setViewingOrder(order)}
              onUpdateStatus={handleUpdateOrderStatus}
              onDeleteOrder={handleRequestDeleteOrder}
            />
          )}

          {activeTab === "users" && (
            <UserList
              users={users}
              currentUser={currentUser}
              onEditUser={(user) => setEditingUser(user)}
              onDeleteUser={handleRequestDeleteUser}
            />
          )}
        </main>
      </div>

      {/* Modal: Create Order */}
      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        products={products}
        onSubmitOrder={handleCreateOrder}
      />

      {/* Modal: Add or Edit Product */}
      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      {/* Modal: View Order Details */}
      <OrderDetailsModal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        order={viewingOrder}
        onUpdateStatus={handleUpdateOrderStatus}
        isAdmin={currentUser.role === "Admin"}
      />

      {/* Modal: Edit User Role & Status */}
      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSaveUser={handleSaveUser}
      />

      {/* Modal: Workable Confirmation for Deletions */}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.title}
        itemName={deleteTarget?.name}
        itemType={deleteTarget?.itemType}
      />
    </div>
  );
}
