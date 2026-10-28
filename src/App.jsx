import React, { useCallback, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
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
  createOrder,
  deleteOrder,
  deleteProduct,
  deleteUser,
  getCurrentUser,
  isBackendConfigured,
  loadAdminData,
  login,
  logout,
  saveProduct,
  saveUser,
  updateOrderStatus,
} from "./services/adminApi";
import { CheckCircle2 } from "lucide-react";

const tabPaths = {
  dashboard: "/dashboard",
  orders: "/orders",
  products: "/products",
  users: "/users",
};

const pathTabs = Object.fromEntries(
  Object.entries(tabPaths).map(([tab, path]) => [path, tab]),
);

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingOrder, setViewingOrder] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [appError, setAppError] = useState("");

  useEffect(() => {
    if (isInitializing) return;
    if (!currentUser) {
      if (location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
      return;
    }

    if (location.pathname === "/" || location.pathname === "/login") {
      navigate("/dashboard", { replace: true });
      return;
    }

    const routeTab = pathTabs[location.pathname];
    if (routeTab) {
      setActiveTab(routeTab);
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [currentUser, isInitializing, location.pathname, navigate]);

  const refreshData = useCallback(async () => {
    setIsDataLoading(true);
    try {
      const data = await loadAdminData();
      setProducts(data.products);
      setOrders(data.orders);
      setUsers(data.users);
      setDashboardMetrics(data.dashboardMetrics);
      setAppError("");
    } finally {
      setIsDataLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const user = await getCurrentUser();
        if (!isMounted) return;
        if (user) {
          const data = await loadAdminData();
          if (!isMounted) return;
          setCurrentUser(user);
          setProducts(data.products);
          setOrders(data.orders);
          setUsers(data.users);
          setDashboardMetrics(data.dashboardMetrics);
        }
      } catch (error) {
        if (isMounted) setAppError(error.message);
      } finally {
        if (isMounted) setIsInitializing(false);
      }
    };

    initialize();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  const handleLogin = async (credentials) => {
    const user = await login(credentials);
    const data = await loadAdminData();
    setCurrentUser(user);
    setProducts(data.products);
    setOrders(data.orders);
    setUsers(data.users);
    setDashboardMetrics(data.dashboardMetrics);
    setAppError("");
    setActiveTab("dashboard");
    navigate("/dashboard", { replace: true });
    showToast(`Welcome back, ${user.name}! Logged in as ${user.role}.`);
  };

  const navigateToTab = (tab) => {
    setActiveTab(tab);
    navigate(tabPaths[tab]);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      setAppError(error.message);
    } finally {
      setCurrentUser(null);
      setActiveTab("dashboard");
    }
  };

  const runMutation = async (operation, successMessage) => {
    setAppError("");
    try {
      await operation();
      await refreshData();
      showToast(successMessage);
    } catch (error) {
      setAppError(error.message);
    }
  };

  const handleCreateOrder = (order) =>
    runMutation(
      () => createOrder(order),
      `Order ${order.id} successfully created.`,
    );

  const handleUpdateOrderStatus = (orderId, status) =>
    runMutation(
      async () => {
        await updateOrderStatus(orderId, status);
        if (viewingOrder?.id === orderId) {
          setViewingOrder((order) => (order ? { ...order, status } : null));
        }
      },
      `Order status updated to "${status}".`,
    );

  const handleSaveProduct = (product) =>
    runMutation(
      () => saveProduct(product, Boolean(editingProduct)),
      editingProduct
        ? `Product "${product.name}" updated successfully.`
        : `New product "${product.name}" added to catalog.`,
    ).then(() => setEditingProduct(null));

  const handleSaveUser = (user) =>
    runMutation(
      () => saveUser(user),
      `User account "${user.name}" updated.`,
    ).then(() => setEditingUser(null));

  const requestDelete = (type, item) => {
    const configurations = {
      product: {
        name: item.name,
        itemType: "product",
        title: "Delete Product",
      },
      order: {
        name: `Order #${item.id} (${item.customerName})`,
        itemType: "order",
        title: "Delete Order Record",
      },
      user: {
        name: `${item.name} (${item.email})`,
        itemType: "user account",
        title: "Delete User Account",
      },
    };
    setDeleteTarget({ type, id: item.id, ...configurations[type] });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;

    const { type, id, name } = deleteTarget;
    const deleteActions = {
      product: deleteProduct,
      order: deleteOrder,
      user: deleteUser,
    };
    const itemLabels = {
      product: `Product "${name}" permanently removed.`,
      order: `${name} permanently removed.`,
      user: `User account "${name}" permanently removed.`,
    };

    runMutation(() => deleteActions[type](id), itemLabels[type]).then(() =>
      setDeleteTarget(null),
    );
  };

  if (isInitializing) {
    return (
      <div className="admin-theme min-h-screen flex items-center justify-center bg-[#f7f7f7] text-sm text-slate-500">
        Connecting to the admin panel...
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginPage
        onLogin={handleLogin}
        isBackendConfigured={isBackendConfigured}
        initialError={appError}
      />
    );
  }

  if (location.pathname === "/login") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="admin-theme min-h-screen bg-[#f7f7f7] flex text-slate-900 font-sans antialiased selection:bg-black selection:text-white">
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
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

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentUser={currentUser}
          onLogout={handleLogout}
          setMobileOpen={setIsMobileMenuOpen}
          activeTab={activeTab}
          globalSearch={globalSearch}
          setGlobalSearch={setGlobalSearch}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {appError && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <span>{appError}</span>
              <button
                type="button"
                onClick={refreshData}
                disabled={isDataLoading}
                className="font-semibold underline disabled:opacity-50"
              >
                {isDataLoading ? "Retrying..." : "Retry"}
              </button>
            </div>
          )}

          {activeTab === "dashboard" && (
            <Dashboard
              orders={orders}
              products={products}
              users={users}
              metrics={dashboardMetrics}
              currentUser={currentUser}
              onNavigate={navigateToTab}
              onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
              onOpenAddProduct={() => {
                setEditingProduct(null);
                setIsProductModalOpen(true);
              }}
              onViewOrder={setViewingOrder}
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
              onDeleteProduct={(product) => requestDelete("product", product)}
            />
          )}

          {activeTab === "orders" && (
            <OrderList
              orders={orders}
              currentUser={currentUser}
              onOpenCreateOrder={() => setIsCreateOrderOpen(true)}
              onViewOrder={setViewingOrder}
              onUpdateStatus={handleUpdateOrderStatus}
              onDeleteOrder={(order) => requestDelete("order", order)}
            />
          )}

          {activeTab === "users" && (
            <UserList
              users={users}
              currentUser={currentUser}
              onEditUser={setEditingUser}
              onDeleteUser={(user) => requestDelete("user", user)}
            />
          )}
        </main>
      </div>

      <CreateOrderModal
        isOpen={isCreateOrderOpen}
        onClose={() => setIsCreateOrderOpen(false)}
        products={products}
        onSubmitOrder={handleCreateOrder}
      />
      <AddProductModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
      <OrderDetailsModal
        isOpen={!!viewingOrder}
        onClose={() => setViewingOrder(null)}
        order={viewingOrder}
        onUpdateStatus={handleUpdateOrderStatus}
        isAdmin={currentUser.role === "admin"}
      />
      <EditUserModal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        user={editingUser}
        onSaveUser={handleSaveUser}
      />
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
