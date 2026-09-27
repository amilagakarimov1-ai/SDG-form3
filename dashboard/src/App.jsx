import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './pages/DashboardLayout';
import MapPage from './pages/MapPage';
import TasksPage from './pages/TasksPage';
import AnalyticsPage from './pages/AnalyticsPage';
import WorkersPage from './pages/WorkersPage';
import ReportsPage from './pages/ReportsPage';
import CitizenDashboard from './pages/CitizenDashboard';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={
          user ? (user.role === 'citizen' ? <Navigate to="/citizen" /> : <Navigate to="/dashboard" />) : <Navigate to="/login" />
        } />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Vətəndaş səhifəsi */}
        <Route path="/citizen" element={
          <ProtectedRoute>
            {user?.role === 'citizen' ? <CitizenDashboard /> : <Navigate to="/dashboard" />}
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {user?.role === 'citizen' ? <Navigate to="/citizen" /> : <DashboardLayout />}
          </ProtectedRoute>
        }>
          <Route index element={<MapPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="workers" element={<WorkersPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="partners" element={<div className="p-6 text-white">Partnyor mağazalar (Tezliklə)</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
