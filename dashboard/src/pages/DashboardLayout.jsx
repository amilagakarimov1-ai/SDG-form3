import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar';
import Header from '../components/Layout/Header';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-dark-bg text-slate-200 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-900/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
