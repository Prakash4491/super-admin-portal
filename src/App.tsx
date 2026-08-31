import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TenantList from "./pages/TenantList";
import TenantForm from "./pages/TenantForm";
import TenantDetails from "./pages/TenantDetails";
import OrganizationList from "./pages/OrganizationList";
import OrganizationDetails from "./pages/OrganizationDetails";
import UserList from "./pages/UserList";
import UserDetails from "./pages/UserDetails";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tenants" element={<TenantList />} />
        <Route path="/tenants/new" element={<TenantForm />} />
        <Route path="/tenants/:id" element={<TenantDetails />} />
        <Route path="/tenants/:id/edit" element={<TenantForm />} />
        <Route path="/organizations" element={<OrganizationList />} />
        <Route path="/organizations/:id" element={<OrganizationDetails />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetails />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
