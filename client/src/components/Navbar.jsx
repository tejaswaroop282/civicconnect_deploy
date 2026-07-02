import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, LayoutDashboard, PlusCircle, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav class="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          {/* Logo */}
          <div class="flex items-center">
            <Link to="/" class="flex items-center gap-2 text-white font-extrabold text-xl tracking-tight">
              <span class="bg-white text-blue-600 p-1.5 rounded-lg shadow-inner font-black text-sm">CC</span>
              CivicConnect
            </Link>
          </div>

          {/* Navigation Links */}
          <div class="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  class="flex items-center gap-1.5 text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  <LayoutDashboard class="w-4 h-4" />
                  Dashboard
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin-dashboard"
                    class="flex items-center gap-1.5 text-amber-200 hover:text-amber-100 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    <Shield class="w-4 h-4" />
                    Admin Panel
                  </Link>
                )}

                <span class="text-white/70 text-sm hidden md:inline px-2">
                  Welcome, <strong class="text-white">{user.name}</strong>
                </span>

                <button
                  onClick={handleLogout}
                  class="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold shadow transition"
                >
                  <LogOut class="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  class="flex items-center gap-1.5 text-white/90 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  <LogIn class="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/register"
                  class="flex items-center gap-1.5 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold shadow-md transition"
                >
                  <UserPlus class="w-4 h-4" />
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
