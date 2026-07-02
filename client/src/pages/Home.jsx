import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Cpu, ArrowRight, Activity, MapPin } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  return (
    <div class="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section class="relative bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 text-white py-24 px-4 overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200 via-indigo-600 to-slate-900 pointer-events-none"></div>
        <div class="max-w-4xl mx-auto text-center relative z-10">
          <span class="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-blue-200 font-semibold px-4 py-1.5 rounded-full text-xs uppercase tracking-wider mb-6">
            Empowering Communties
          </span>
          <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6">
            Better Cities, <br class="md:hidden" />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">One Report</span> at a Time
          </h1>
          <p class="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Report local issues like potholes, streetlights, or trash dumping. CivicConnect uses Gemini AI to auto-classify and route issues to municipal agencies instantly.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link
                to="/dashboard"
                class="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Go to Dashboard
                <ArrowRight class="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  class="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3.5 rounded-xl font-bold text-lg shadow-md transition-all duration-200 transform hover:-translate-y-0.5 w-full sm:w-auto"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  class="flex items-center justify-center gap-2 border border-white/40 bg-white/10 hover:bg-white/20 px-8 py-3.5 rounded-xl font-bold text-lg shadow-inner transition-all duration-200 w-full sm:w-auto"
                >
                  Create Account
                  <ArrowRight class="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">How CivicConnect Works</h2>
          <p class="text-slate-500 max-w-xl mx-auto mt-4">Our smart issue management pipeline speeds up resolution by routing reports automatically.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div class="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <MapPin class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">1. Pinpoint Issues</h3>
            <p class="text-slate-600 leading-relaxed text-sm">
              Describe the issue and pinpoint the location. Upload photo proof to help agencies quickly identify the situation.
            </p>
          </div>

          {/* Card 2 */}
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div class="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Cpu class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">2. AI Classification</h3>
            <p class="text-slate-600 leading-relaxed text-sm">
              Gemini AI analyzes the description to categorize the issue (e.g. Waste Management, Road Maintenance) and checks for duplicates.
            </p>
          </div>

          {/* Card 3 */}
          <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div class="bg-amber-50 text-amber-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">3. SLA Tracking</h3>
            <p class="text-slate-600 leading-relaxed text-sm">
              Each issue is bound to Service Level Agreements (SLA). The system monitors resolution progress and alerts administrators on breaches.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
