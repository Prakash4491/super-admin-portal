# Super Admin Portal

Frontend-only implementation of the **Super Admin Portal – Global Dashboard & Tenant Management** assignment.

The assignment requires:

- Global Dashboard
- Tenant Management
- Search
- Status and plan filters
- Pagination
- Sorting
- Create Tenant
- View Tenant
- Edit Tenant
- Activate / Deactivate
- TanStack Query for tenant server-state operations

This version intentionally has **no backend**. Tenant data is defined in a TypeScript array and an in-memory data service simulates API operations. TanStack Query is still used for queries, mutations, caching, refetching, and invalidation so the frontend structure can later be connected to a real REST API.

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Recharts

## Main hooks

```text
src/hooks/useTenants.ts
src/hooks/useDashboard.ts
```

The tenant hooks include:

```text
useTenants()
useTenant()
useTenantStats()
useCreateTenant()
useUpdateTenant()
useActivateTenant()
useDeactivateTenant()
```

## No backend yet

The assignment document does not specify a particular backend/database implementation. This project therefore keeps the scope to the requested React frontend and uses local defined data.
