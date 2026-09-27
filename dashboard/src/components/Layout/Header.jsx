import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getPageTitle = (pathname) => {
  if (pathname === '/dashboard') return 'Live Map Overview';
  const path = pathname.split('/').pop();
  return path.charAt(0).toUpperCase() + path.slice(1);
};

export default function Header() {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <header className="bg-slate-900 border-b border-slate-800 h-16 flex items-center justify-between px-6 shrink-0">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      
      <div className="flex items-center gap-6">
        <div className="text-sm text-slate-400 font-medium">
          Tbilisi Municipality
        </div>
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-brand rounded-full ring-2 ring-slate-900"></span>
        </button>
      </div>
    </header>
  );
}
