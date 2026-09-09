import { Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TenantList from "./pages/TenantList";
import TenantForm from "./pages/TenantForm";
import TenantDetails from "./pages/TenantDetails";
import OrganizationList from "./pages/OrganizationList";
import OrganizationDetails from "./pages/OrganizationDetails";
import UserList from "./pages/UserList";
import UserDetails from "./pages/UserDetails";
import RoleList from "./pages/RoleList";
import RoleDetails from "./pages/RoleDetails";
import PermissionList from "./pages/PermissionList";
import PermissionDetails from "./pages/PermissionDetails";
import DataPermissions from "./pages/DataPermissions";
import DataPermissionDetails from "./pages/DataPermissionDetails";
import PlatformConfiguration from "./pages/PlatformConfiguration";
import FeatureManagement from "./pages/FeatureManagement";
import LicenseManagement from "./pages/LicenseManagement";
import AuditLogs from "./pages/AuditLogs";
import GlobalSettings from "./pages/GlobalSettings";
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tenants" element={<TenantList />} />
          <Route path="/tenants/new" element={<TenantForm />} />
          <Route path="/tenants/:id" element={<TenantDetails />} />
          <Route path="/tenants/:id/edit" element={<TenantForm />} />
          <Route path="/organizations" element={<OrganizationList />} />
          <Route path="/organizations/:id" element={<OrganizationDetails />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/roles" element={<RoleList />} />
          <Route path="/roles/:id" element={<RoleDetails />} />
          <Route path="/permissions" element={<PermissionList />} />
          <Route path="/permissions/:id" element={<PermissionDetails />} />
          <Route path="/dataPermissions" element={<DataPermissions />} />
          <Route
            path="/dataPermissions/:id"
            element={<DataPermissionDetails />}
          />
          <Route
            path="/platform-configuration"
            element={<PlatformConfiguration />}
          />
          <Route path="/feature-management" element={<FeatureManagement />} />
          <Route path="/license-management" element={<LicenseManagement />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/global-settings" element={<GlobalSettings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
