import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Building2,
  ChevronLeft,
  ClipboardList,
  CreditCard,
  Globe2,
  KeyRound,
  LayoutDashboard,
  Menu,
  Settings,
  Shield,
  Users,
  X,
} from "lucide-react";
import { logout } from "../services/authService";
export default function Layout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  function handleLogout() {
    logout();
    navigate("/login", {
      replace: true,
    });
  }
  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <aside
        className={`fixed left-0 top-0 z-40 hidden h-screen overflow-hidden bg-gradient-to-b from-[#172b62] via-[#1d3f91] to-[#2563eb] transition-all duration-300 lg:block ${
          sidebarCollapsed ? "w-[76px]" : "w-[300px]"
        }`}
      >
        <div
          className={`flex h-[86px] items-center ${
            sidebarCollapsed ? "justify-center" : "gap-3 px-8"
          }`}
        >
          {sidebarCollapsed ? (
            <button
              type="button"
              onClick={() => setSidebarCollapsed(false)}
              title="Maximize sidebar"
              aria-label="Maximize sidebar"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[16px] font-extrabold text-slate-900 shadow-sm transition hover:bg-slate-100"
            >
              SA
            </button>
          ) : (
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white text-[16px] font-extrabold text-slate-900 shadow-sm"
              title="Super Admin"
            >
              SA
            </div>
          )}
          {!sidebarCollapsed && (
            <>
              <div className="min-w-0">
                <h1 className="text-[16px] font-extrabold leading-tight text-white">
                  Super Admin
                </h1>
                <p className="mt-1 text-[14px] font-medium text-blue-100">
                  Control Center
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSidebarCollapsed(true)}
                title="Minimize sidebar"
                aria-label="Minimize sidebar"
                className="ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-lg text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>
            </>
          )}
        </div>
        <div className="flex h-[calc(100vh-86px)] flex-col px-3 pb-8">
          <nav className="space-y-0.5">
            <NavItem
              to="/dashboard"
              icon={<LayoutDashboard size={19} />}
              label="Dashboard"
              end
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/tenants"
              icon={<Building2 size={19} />}
              label="Tenants"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/organizations"
              icon={<Building2 size={19} />}
              label="Organizations"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/users"
              icon={<Users size={19} />}
              label="Users"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/roles"
              icon={<Shield size={19} />}
              label="Roles"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/permissions"
              icon={<KeyRound size={19} />}
              label="Permissions"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/dataPermissions"
              icon={<Shield size={19} />}
              label="Data Permissions"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/platform-configuration"
              icon={<Settings size={19} />}
              label="Platform Configuration"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/feature-management"
              icon={<Settings size={19} />}
              label="Feature Management"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/license-management"
              icon={<CreditCard size={19} />}
              label="License Management"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/audit-logs"
              icon={<ClipboardList size={19} />}
              label="Audit Logs"
              collapsed={sidebarCollapsed}
            />
            <NavItem
              to="/global-settings"
              icon={<Globe2 size={19} />}
              label="Global Settings"
              collapsed={sidebarCollapsed}
            />
          </nav>
          <div className="shrink-0 pt-4 pb-2">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-2 px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-[13px] font-medium text-blue-100">
                  Platform online
                </span>
              </div>
            ) : (
              <div className="flex justify-center py-3" title="Platform online">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </div>
            )}
          </div>
        </div>
      </aside>
      {mobileMenuOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-[300px] overflow-y-auto bg-gradient-to-b from-[#172b62] via-[#1d3f91] to-[#2563eb] shadow-2xl lg:hidden">
            <div className="flex h-[92px] items-center justify-between px-8">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[16px] font-extrabold text-slate-900">
                  SA
                </div>
                <div>
                  <h1 className="text-[16px] font-extrabold text-white">
                    Super Admin
                  </h1>
                  <p className="mt-1 text-[14px] text-blue-100">
                    Control Center
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-9 w-9 place-items-center rounded-lg text-blue-100 transition hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1.5 px-3">
              <MobileNavItem
                to="/dashboard"
                icon={<LayoutDashboard size={19} />}
                label="Dashboard"
                end
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/tenants"
                icon={<Building2 size={19} />}
                label="Tenants"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/organizations"
                icon={<Building2 size={19} />}
                label="Organizations"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/users"
                icon={<Users size={19} />}
                label="Users"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/roles"
                icon={<Shield size={19} />}
                label="Roles"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/permissions"
                icon={<KeyRound size={19} />}
                label="Permissions"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/dataPermissions"
                icon={<Shield size={19} />}
                label="Data Permissions"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/platform-configuration"
                icon={<Settings size={19} />}
                label="Platform Configuration"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/feature-management"
                icon={<Settings size={19} />}
                label="Feature Management"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/license-management"
                icon={<CreditCard size={19} />}
                label="License Management"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/audit-logs"
                icon={<ClipboardList size={19} />}
                label="Audit Logs"
                onClick={() => setMobileMenuOpen(false)}
              />
              <MobileNavItem
                to="/global-settings"
                icon={<Globe2 size={19} />}
                label="Global Settings"
                onClick={() => setMobileMenuOpen(false)}
              />
            </nav>
            <div className="mt-8 flex items-center gap-2 px-8 pb-8">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="text-[13px] text-blue-100">Platform online</span>
            </div>
          </aside>
        </>
      )}
      <div
        className={`min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-[76px]" : "lg:ml-[300px]"
        }`}
      >
        <header className="sticky top-0 z-30 flex h-[92px] items-center justify-between border-b border-blue-100 bg-[#dbeafe] px-5 sm:px-8">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-10 w-10 place-items-center rounded-lg bg-white text-slate-700 shadow-sm lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <strong className="block text-[13px] font-extrabold text-slate-900">
                Super Administrator
              </strong>
              <span className="text-[13px] text-slate-500">Global access</span>
            </div>
            <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-[12px] font-extrabold text-slate-800 shadow-sm">
              SA
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-xs font-extrabold text-red-600 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-5 sm:p-7">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
type NavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
  end?: boolean;
  collapsed?: boolean;
};
function NavItem({ to, icon, label, end, collapsed = false }: NavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        `group flex h-[43px] items-center rounded-[9px] text-[15px] font-medium transition-all ${
          collapsed ? "justify-center px-2" : "gap-3 px-5"
        } ${
          isActive
            ? "bg-[#3b82f6] text-white shadow-sm"
            : "text-blue-50 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </NavLink>
  );
}
type MobileNavItemProps = {
  to: string;
  icon: ReactNode;
  label: string;
  end?: boolean;
  onClick: () => void;
};
function MobileNavItem({ to, icon, label, end, onClick }: MobileNavItemProps) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex h-[43px] items-center gap-3 rounded-[9px] px-5 text-[15px] font-medium transition ${
          isActive
            ? "bg-[#3b82f6] text-white shadow-sm"
            : "text-blue-50 hover:bg-white/10 hover:text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
