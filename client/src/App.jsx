import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component for general logged-in users
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

// Protected Route Component for Admins only
function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  if (loading) return (
    <div class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  return user && isAdmin ? children : <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <div class="flex flex-col min-h-screen">
      <Navbar />
      <div class="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <footer class="bg-slate-900 text-slate-400 py-6 mt-12 text-center text-sm border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4">
          <p>&copy; 2024 CivicConnect. Making cities better, one report at a time.</p>
          <p class="text-xs text-slate-500 mt-1">Built with React, Tailwind CSS v4, Node.js & MongoDB</p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
