import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Building2,
  KeyRound,
  LayoutDashboard,
  Shield,
  Menu,
  X,
  Settings,
} from "lucide-react";
import { Users } from "lucide-react";
export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-page">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#2563eb] p-5 text-white lg:flex">
        <div className="flex items-center gap-3 px-2 pb-8">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-extrabold text-slate-950">
            SA
          </div>
          <div>
            <strong className="block text-sm">Super Admin</strong>
            <span className="text-xs text-slate-300">Control Center</span>
          </div>
        </div>
        {/* Desktop Navigation */}
        <nav className="space-y-1.5">
          <NavItem
            to="/"
            icon={<LayoutDashboard size={17} />}
            label="Dashboard"
            end
          />
          <NavItem
            to="/tenants"
            icon={<Building2 size={17} />}
            label="Tenants"
          />
        </nav>
        <NavItem
          to="/organizations"
          icon={<Building2 size={17} />}
          label="Organizations"
        />
        <NavItem to="/users" icon={<Users size={17} />} label="Users" />
        <NavItem to="/roles" icon={<Shield size={17} />} label="Roles" />
        <NavItem
          to="/permissions"
          icon={<KeyRound size={17} />}
          label="Permissions"
        />
        <NavItem
          to="/dataPermissions"
          icon={<Shield size={17} />}
          label="Data Permissions"
        />
        <NavItem
          to="/platform-configuration"
          icon={<Settings size={17} />}
          label="Platform Configuration"
        />
        <div className="mt-auto flex items-center gap-2 px-2 text-xs text-slate-300">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Platform online
        </div>
      </aside>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-gradient-to-b from-[#172554] via-[#1e3a8a] to-[#2563eb] p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-extrabold text-slate-950">
                  SA
                </div>
                <div>
                  <strong className="block text-sm">Super Admin</strong>
                  <span className="text-xs text-slate-300">Control Center</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-slate-200 hover:bg-blue-900 hover:text-white"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            {/* Mobile Navigation */}
            <nav className="space-y-1.5">
              <NavItem
                to="/"
                icon={<LayoutDashboard size={17} />}
                label="Dashboard"
                end
                onClick={() => setMobileMenuOpen(false)}
              />
              <NavItem
                to="/tenants"
                icon={<Building2 size={17} />}
                label="Tenants"
                onClick={() => setMobileMenuOpen(false)}
              />
            </nav>
            <NavItem
              to="/organizations"
              icon={<Building2 size={17} />}
              label="Organizations"
              onClick={() => setMobileMenuOpen(false)}
            />
            <NavItem
              to="/users"
              icon={<Users size={17} />}
              label="Users"
              onClick={() => setMobileMenuOpen(false)}
            />
            <NavItem
              to="/roles"
              icon={<Users size={17} />}
              label="Roles"
              onClick={() => setMobileMenuOpen(false)}
            />
            <NavItem
              to="/permissions"
              icon={<KeyRound size={17} />}
              label="Permissions"
              onClick={() => setMobileMenuOpen(false)}
            />
            <NavItem
              to="/dataPermissions"
              icon={<Shield size={17} />}
              label="Data Permissions"
              onClick={() => setMobileMenuOpen(false)}
            />
            <NavItem
              to="/platform-configuration"
              icon={<Settings size={17} />}
              label="Platform Configuration"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute bottom-6 left-5 flex items-center gap-2 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Platform online
            </div>
          </aside>
        </div>
      )}
      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between border-b border-blue-100 bg-blue-100 px-5 backdrop-blur md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-blue-900 hover:bg-blue-200 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={25} />
            </button>
            <div>
              <div className="text-[10px] font-extrabold tracking-[0.14em] text-slate-500">
                ONE ENTERPRISE CLOUD
              </div>
              <h1 className="mt-1 text-lg font-extrabold text-blue-600">
                Super Admin Portal
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <strong className="block text-xs">Super Administrator</strong>
              <span className="text-[13px] text-slate-500">Global access</span>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[11px] font-extrabold">
              SA
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-[1500px] p-5 pb-8 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
function NavItem({
  to,
  icon,
  label,
  end,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
          isActive
            ? "bg-blue-500 text-white"
            : "text-blue-100 hover:bg-blue-900 hover:text-white"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
