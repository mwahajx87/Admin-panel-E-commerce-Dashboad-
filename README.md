# E-Commerce Admin Panel

Live admin panel: https://admin-panel-e-commerce-dashboad.vercel.app/.

The admin app is deployed separately and can be routed through the storefront
at `https://e-commerce-website-react-js-phi.vercel.app/admin`. It authenticates
administrators through the backend API.

## Development

From the workspace root, install each app's dependencies, configure
`backend/.env`, then seed MongoDB:

```powershell
npm install --prefix backend
npm install --prefix Admin-panel-E-commerce-Dashboad-
npm install --prefix E-Commerce-Website--React-js-
npm --prefix backend run seed
npm run dev
```

The admin Vite server runs on port 5174 and proxies `/api` to port 5000. The
workspace root README documents production build and start commands.

For the admin Vercel deployment, keep `VITE_ADMIN_BASE_PATH=/admin` (the
default) and leave `VITE_API_BASE_URL` unset. Its `/api` route proxies to the
backend configured in `vercel.json`.

To serve the separate admin deployment at the storefront URL, add these
rewrites to the storefront project's `vercel.json` before its catch-all
rewrite. Keep its `/api` rewrite pointed at the same backend:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://ecommerce-backend-nine-zeta.vercel.app/api/:path*"
    },
    {
      "source": "/admin",
      "destination": "https://admin-panel-e-commerce-dashboad.vercel.app/admin"
    },
    {
      "source": "/admin/:path*",
      "destination": "https://admin-panel-e-commerce-dashboad.vercel.app/admin/:path*"
    },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

The storefront `/api` rewrite is needed because browser API calls remain on
the storefront origin. Do not configure the production backend as
`localhost:5000`; localhost is only reachable from the developer's computer.
After deploying the storefront rewrite, check `/admin/login` and confirm
`/api/auth/me` responds from the backend.

## Admin API

Administrator CRUD operations use `/api/admin/products`, `/api/admin/orders`,
`/api/admin/users`, and `/api/admin/dashboard`. All `/api/admin/*` routes
require an active user with the `admin` role. The storefront reads products
from `/api/products` and creates orders through `/api/orders`.
