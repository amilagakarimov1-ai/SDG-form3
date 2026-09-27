import { NavLink, useNavigate } from 'react-router-dom';
import { Map, CheckSquare, FileText, Users, BarChart3, Store, Leaf, LogOut } from 'lucide-react';
import useAuthStore from '../../store/authStore';

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    storeLogout();
    navigate('/login', { replace: true });
  };

  const links = [
    { to: '/dashboard', icon: Map, label: 'Xəritə', end: true },
    { to: '/dashboard/tasks', icon: CheckSquare, label: 'Tapşırıqlar' },
    { to: '/dashboard/reports', icon: FileText, label: 'Hesabatlar' },
    { to: '/dashboard/workers', icon: Users, label: 'İşçilər' },
    { to: '/dashboard/analytics', icon: BarChart3, label: 'Analitika' },
    { to: '/dashboard/partners', icon: Store, label: 'Partnyor' },
  ];

  const initials = user?.name ? user.name.charAt(0).toUpperCase() : 'M';

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-green-500/20 p-2 rounded-lg border border-green-500/30">
          <Leaf className="w-6 h-6 text-green-500" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">FixiFy Admin</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-green-500/10 text-green-400 font-medium border border-green-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User profile + logout */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-800/50">
          <div className="w-9 h-9 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center text-sm font-bold text-green-400 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.name ?? 'Bələdiyyə Admin'}
            </p>
            <p className="text-xs text-slate-400 truncate">
              {user?.email ?? 'admin@baku.gov.az'}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Çıxış
        </button>
      </div>
    </div>
  );
}
