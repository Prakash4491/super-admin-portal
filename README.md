# Super Admin Portal — React + TypeScript + Tailwind CSS

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
- Axios is not required because this version has no HTTP backend

## Run

```bash
npm install
npm run dev
```

Open the URL shown by Vite, normally:

```text
http://localhost:5173
```

## Main frontend concepts

```text
UI
 ↓
Custom TanStack Query hooks
 ↓
Local data service
 ↓
Defined tenant array
```

Later, replacing the data-service functions with Axios/fetch calls is enough to move toward a real backend.

## Important TanStack Query flow

```text
Create / Update / Activate / Deactivate
              ↓
          Mutation
              ↓
       Local data changes
              ↓
     invalidateQueries()
              ↓
        Query refetches
              ↓
          UI updates
```

## Data location

The initial tenant data is in:

```text
src/data/tenants.ts
```

The simulated CRUD operations are in:

```text
src/services/tenantService.ts
```

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
