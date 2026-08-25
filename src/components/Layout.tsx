import { NavLink, Outlet } from "react-router-dom";
import { Building2, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function Layout() {
  return (
    <div className="min-h-screen bg-page">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-slate-950 p-5 text-white lg:flex">
        <div className="flex items-center gap-3 px-2 pb-8">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-sm font-extrabold text-slate-950">
            SA
          </div>
          <div>
            <strong className="block text-sm">Super Admin</strong>
            <span className="text-xs text-slate-400">Control Center</span>
          </div>
        </div>

        <nav className="space-y-1.5">
          <NavItem to="/" icon={<LayoutDashboard size={17} />} label="Dashboard" end />
          <NavItem to="/tenants" icon={<Building2 size={17} />} label="Tenants" />
        </nav>

        <div className="mt-auto flex items-center gap-2 px-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Platform online
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between border-b border-line bg-white/95 px-5 backdrop-blur md:px-8">
          <div>
            <div className="text-[10px] font-extrabold tracking-[0.14em] text-slate-500">
              ONE ENTERPRISE CLOUD
            </div>
            <h1 className="mt-1 text-lg font-extrabold">Super Admin Portal</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <strong className="block text-xs">Super Administrator</strong>
              <span className="text-[11px] text-slate-400">Global access</span>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-[11px] font-extrabold">
              SA
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1500px] p-5 md:p-8">
          <Outlet />
        </main>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-slate-200 bg-white lg:hidden">
        <NavItem to="/" icon={<LayoutDashboard size={16} />} label="Dashboard" end mobile />
        <NavItem to="/tenants" icon={<Building2 size={16} />} label="Tenants" mobile />
      </div>
    </div>
  );
}

function NavItem({
  to,
  icon,
  label,
  end,
  mobile
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  end?: boolean;
  mobile?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        mobile
          ? `flex flex-1 flex-col items-center gap-1 px-2 py-2 text-[10px] ${
              isActive ? "text-slate-950" : "text-slate-400"
            }`
          : `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
              isActive
                ? "bg-slate-800 text-white"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
}
