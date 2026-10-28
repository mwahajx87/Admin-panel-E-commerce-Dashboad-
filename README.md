# E-Commerce Admin Panel

Live admin panel: https://admin-panel-e-commerce-dashboad.vercel.app/.

The admin app can be served at `/admin` by the shared Express backend or at
the root of its own domain. It uses the same MongoDB database as the storefront
and authenticates administrators through `/api/auth`.

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

For its standalone Vercel deployment, keep `VITE_ADMIN_BASE_PATH=/admin`
(the default) and leave `VITE_API_BASE_URL` unset so the app calls its own
`/api` route. The standalone deployment must be rebuilt after changing these
Vercel environment variables.

## Admin API

Administrator CRUD operations use `/api/admin/products`, `/api/admin/orders`,
`/api/admin/users`, and `/api/admin/dashboard`. All `/api/admin/*` routes
require an active user with the `admin` role. The storefront reads products
from `/api/products` and creates orders through `/api/orders`.
