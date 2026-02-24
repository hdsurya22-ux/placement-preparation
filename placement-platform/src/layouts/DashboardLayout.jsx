import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  ClipboardList,
  BookOpen,
  User
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/dashboard/practice", label: "Practice", icon: Code2 },
  { to: "/dashboard/assessments", label: "Assessments", icon: ClipboardList },
  { to: "/dashboard/resources", label: "Resources", icon: BookOpen },
  { to: "/dashboard/profile", label: "Profile", icon: User }
];

function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950/80 px-4 py-6 flex flex-col">
        <div className="mb-8 px-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Placement Prep
          </span>
        </div>
        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-300 hover:bg-slate-900 hover:text-slate-50"
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/80 backdrop-blur">
          <div>
            <h1 className="text-lg font-semibold text-slate-50">
              Placement Prep
            </h1>
            <p className="text-xs text-slate-400">
              Central workspace for your placement journey.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">You</span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-xs font-medium">
              U
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-6 bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

