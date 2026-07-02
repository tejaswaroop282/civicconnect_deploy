import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Plus, CheckCircle, Info, Image as ImageIcon, MapPin } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Road Maintenance');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('17.3850');
  const [longitude, setLongitude] = useState('78.4867');
  const [priority, setPriority] = useState('medium');
  const [file, setFile] = useState(null);

  // Fetch issues
  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/issues/my-issues');
      const data = await res.json();
      if (res.ok && data.success) {
        setIssues(data.issues);
      }
    } catch (err) {
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !location || !latitude || !longitude) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setSuccess('');
    setSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('location', location);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('priority', priority);
    if (file) {
      formData.append('image', file);
    }

    try {
      const res = await fetch('/api/issues/report', {
        method: 'POST',
        body: formData, // FormData automatically sets correct headers
      });
      const data = await res.json();
      setSubmitting(false);

      if (res.ok && data.success) {
        setSuccess('Issue reported successfully!');
        setTitle('');
        setDescription('');
        setLocation('');
        setFile(null);
        fetchIssues();
        setTimeout(() => {
          setShowModal(false);
          setSuccess('');
        }, 1500);
      } else {
        setError(data.error || 'Failed to submit report.');
      }
    } catch (err) {
      setSubmitting(false);
      setError('Network error. Please try again.');
    }
  };

  // Initialize Leaflet Map on modal open
  useEffect(() => {
    if (!showModal) return;

    const timer = setTimeout(() => {
      if (!window.L) return;
      
      const mapContainer = document.getElementById('map-picker');
      if (!mapContainer) return;

      const initLat = parseFloat(latitude) || 20.5937;
      const initLng = parseFloat(longitude) || 78.9629;

      const map = window.L.map('map-picker').setView([initLat, initLng], 5);
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      let marker = window.L.marker([initLat, initLng]).addTo(map);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        marker.setLatLng([lat, lng]);
      });

      // Cleanup map instance on close
      return () => {
        map.remove();
      };
    }, 200);

    return () => clearTimeout(timer);
  }, [showModal]);

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Citizen Dashboard</h1>
          <p class="text-slate-500 text-sm">Track your reported issues and file new civic reports.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
        >
          <Plus class="w-5 h-5" />
          Report New Issue
        </button>
      </div>

      {/* Main Issue Listing */}
      {loading ? (
        <div class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : issues.length === 0 ? (
        <div class="bg-white text-center py-16 px-4 rounded-2xl border border-slate-100 shadow-sm max-w-xl mx-auto mt-6">
          <Info class="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 class="text-lg font-bold text-slate-800">No issues reported yet</h3>
          <p class="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Everything seems clean and operational in your neighborhood! Tap "Report New Issue" to file a report.
          </p>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <div key={issue._id} class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition">
              {issue.imageUrl && (
                <div class="h-48 overflow-hidden bg-slate-100">
                  <img src={issue.imageUrl} alt={issue.title} class="w-full h-full object-cover" />
                </div>
              )}
              <div class="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-md">
                      {issue.category}
                    </span>
                    <span class={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                      issue.status === 'resolved' ? 'bg-green-50 text-green-700' :
                      issue.status === 'in-progress' ? 'bg-orange-50 text-orange-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {issue.status}
                    </span>
                  </div>

                  <h3 class="text-lg font-bold text-slate-900 mb-2 truncate">{issue.title}</h3>
                  <p class="text-slate-600 text-sm line-clamp-2 mb-4">{issue.description}</p>
                </div>

                <div class="border-t border-slate-50 pt-4 flex flex-col gap-2">
                  <div class="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin class="w-4 h-4 flex-shrink-0 text-slate-400" />
                    <span class="truncate">{issue.location.address || issue.location}</span>
                  </div>
                  {issue.isDuplicate && (
                    <div class="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2 py-0.5 rounded border border-amber-100 self-start">
                      <AlertCircle class="w-3 h-3" />
                      Potential Duplicate
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {showModal && (
        <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-black text-slate-900 mb-4">Report Civic Issue</h2>

            {error && (
              <div class="flex items-center gap-2 bg-red-50 text-red-700 p-3.5 rounded-xl text-sm border border-red-100 mb-4">
                <AlertCircle class="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div class="flex items-center gap-2 bg-green-50 text-green-700 p-3.5 rounded-xl text-sm border border-green-100 mb-4">
                <CheckCircle class="w-5 h-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleReportSubmit} class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Issue Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  class="block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  placeholder="e.g. Large pothole on main road"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Description *</label>
                <textarea
                  required
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  class="block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  placeholder="Describe the issue. (Gemini AI will automatically refine the category classification)"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Backup Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    class="block w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  >
                    <option>Road Maintenance</option>
                    <option>Street Lighting</option>
                    <option>Waste Management</option>
                    <option>Water Supply</option>
                    <option>Sanitation</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    class="block w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Location Address *</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  class="block w-full rounded-xl border border-slate-200 py-2.5 px-3.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition"
                  placeholder="e.g. 5th Avenue, near Central Park"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Mark Location on Map (Click to Set)</label>
                <div id="map-picker" class="h-48 w-full rounded-xl border border-slate-200 shadow-inner z-0 mb-3"></div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    class="block w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    class="block w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Upload Photo</label>
                <div class="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    class="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <ImageIcon class="w-8 h-8 text-slate-400 mb-2" />
                  <span class="text-xs text-slate-600 font-semibold">
                    {file ? file.name : 'Click to select or drag photo here'}
                  </span>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4.5 py-2.5 rounded-xl text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow transition disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
