const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/+$/,
  "",
);
const adminBasePath = (
  import.meta.env.VITE_ADMIN_BASE_PATH || "/admin"
).replace(/\/+$/, "");
const adminLoginPath = `${adminBasePath}/login` || "/login";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(path, { method = "GET", body } = {}) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch {
    throw new Error(
      "Could not reach the API. Check the backend URL and network connection.",
    );
  }

  if (!response.ok) {
    let message = `Request failed (${response.status}).`;
    try {
      const payload = await response.json();
      message = payload.message || payload.error || message;
    } catch {
      // Retain the status message for non-JSON responses.
    }
    if (
      [401, 403].includes(response.status) &&
      window.location.pathname !== adminLoginPath
    ) {
      window.location.assign(adminLoginPath);
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return null;
  return response.json();
}

const isUnauthorized = (error) =>
  error instanceof ApiError && [401, 403].includes(error.status);

export const isBackendConfigured = true;

export async function getCurrentUser() {
  try {
    const payload = await request("/auth/me");
    return payload.user;
  } catch (error) {
    if (isUnauthorized(error)) return null;
    throw error;
  }
}

export async function login(credentials) {
  const payload = await request("/auth/login", {
    method: "POST",
    body: credentials,
  });
  if (payload.user.role !== "admin") {
    await logout();
    throw new ApiError("Administrator access is required.", 403);
  }
  return payload.user;
}

export async function logout() {
  await request("/auth/logout", { method: "POST" });
}

export async function loadAdminData() {
  const [products, orders, users, dashboardMetrics] = await Promise.all([
    request("/admin/products"),
    request("/admin/orders"),
    request("/admin/users"),
    request("/admin/dashboard/metrics"),
  ]);
  return { products, orders, users, dashboardMetrics };
}

export async function saveProduct(product, isEditing) {
  const path = isEditing
    ? `/admin/products/${encodeURIComponent(product.id)}`
    : "/admin/products";
  return request(path, {
    method: isEditing ? "PUT" : "POST",
    body: product,
  });
}

export async function deleteProduct(id) {
  return request(`/admin/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function createOrder(order) {
  return request("/admin/orders", { method: "POST", body: order });
}

export async function updateOrderStatus(id, status) {
  return request(`/admin/orders/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { status },
  });
}

export async function deleteOrder(id) {
  return request(`/admin/orders/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function saveUser(user) {
  return request(`/admin/users/${encodeURIComponent(user.id)}`, {
    method: "PATCH",
    body: { role: user.role, status: user.status },
  });
}

export async function deleteUser(id) {
  return request(`/admin/users/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
