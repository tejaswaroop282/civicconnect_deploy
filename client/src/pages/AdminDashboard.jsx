import { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Edit, CheckCircle, Clock, ListFilter, MapPin, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Selected Issue for details modal / actions
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const [adminRemarks, setAdminRemarks] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const query = new URLSearchParams();
      if (statusFilter) query.append('status', statusFilter);
      if (categoryFilter) query.append('category', categoryFilter);
      if (priorityFilter) query.append('priority', priorityFilter);

      const res = await fetch(`/api/admin/dashboard?${query.toString()}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setIssues(data.issues);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [statusFilter, categoryFilter, priorityFilter]);

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue);
    setNewStatus(issue.status);
    setAdminRemarks(issue.adminRemarks || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setUpdating(true);

    try {
      const res = await fetch(`/api/admin/issues/${selectedIssue._id}/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, adminRemarks }),
      });
      const data = await res.json();
      setUpdating(false);

      if (res.ok && data.success) {
        setSelectedIssue(null);
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to update issue');
      }
    } catch (err) {
      setUpdating(false);
      alert('Network error. Please try again.');
    }
  };

  const handleDeleteIssue = async (issueId) => {
    if (!window.confirm('Are you sure you want to delete this report permanently?')) return;
    try {
      const res = await fetch(`/api/admin/issues/${issueId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (selectedIssue?._id === issueId) {
          setSelectedIssue(null);
        }
        fetchDashboardData();
      } else {
        alert(data.error || 'Failed to delete issue');
      }
    } catch (err) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-black text-slate-900 tracking-tight">Admin Control Panel</h1>
        <p class="text-slate-500 text-sm">Review, assign, and update reported civic concerns.</p>
      </div>

      {/* Stats Grid */}
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs font-semibold text-slate-400 uppercase">Total Reports</span>
          <p class="text-3xl font-black text-slate-800 mt-1">{stats.total}</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-slate-400">
          <span class="text-xs font-semibold text-slate-400 uppercase">Pending</span>
          <p class="text-3xl font-black text-slate-700 mt-1">{stats.pending}</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-orange-500">
          <span class="text-xs font-semibold text-slate-400 uppercase">In Progress</span>
          <p class="text-3xl font-black text-orange-600 mt-1">{stats.inProgress}</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm border-l-4 border-l-green-500">
          <span class="text-xs font-semibold text-slate-400 uppercase">Resolved</span>
          <p class="text-3xl font-black text-green-600 mt-1">{stats.resolved}</p>
        </div>
        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <span class="text-xs font-semibold text-slate-400 uppercase">Total Citizens</span>
          <p class="text-3xl font-black text-slate-800 mt-1">{stats.totalUsers}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div class="flex items-center gap-2 text-slate-600 font-semibold text-sm">
          <ListFilter class="w-4 h-4" />
          Filter Reports:
        </div>
        <div class="flex flex-wrap gap-3 items-center flex-grow justify-end">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            class="rounded-xl border border-slate-200 py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            class="rounded-xl border border-slate-200 py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            <option>Road Maintenance</option>
            <option>Street Lighting</option>
            <option>Waste Management</option>
            <option>Water Supply</option>
            <option>Sanitation</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            class="rounded-xl border border-slate-200 py-1.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Issues Table */}
      {loading ? (
        <div class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : issues.length === 0 ? (
        <div class="bg-white text-center py-16 px-4 rounded-2xl border border-slate-100 shadow-sm max-w-md mx-auto">
          <ShieldAlert class="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 class="text-lg font-bold text-slate-800">No reports found</h3>
          <p class="text-slate-500 text-sm mt-1">Try modifying your filter settings above.</p>
        </div>
      ) : (
        <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                  <th class="p-4">Title</th>
                  <th class="p-4">Category</th>
                  <th class="p-4">Reporter</th>
                  <th class="p-4">Priority</th>
                  <th class="p-4">Status</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-sm">
                {issues.map((issue) => (
                  <tr key={issue._id} class="hover:bg-slate-50/50 transition">
                    <td class="p-4">
                      <div class="font-bold text-slate-800">{issue.title}</div>
                      <div class="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin class="w-3 h-3 flex-shrink-0" />
                        <span>{issue.location.address || issue.location}</span>
                      </div>
                    </td>
                    <td class="p-4">
                      <span class="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                        {issue.category}
                      </span>
                    </td>
                    <td class="p-4">
                      <div class="font-semibold text-slate-700">{issue.reportedBy?.name}</div>
                      <div class="text-xs text-slate-400">{issue.reportedBy?.phone}</div>
                    </td>
                    <td class="p-4">
                      <span class={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        issue.priority === 'high' ? 'bg-red-50 text-red-700' :
                        issue.priority === 'medium' ? 'bg-orange-50 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {issue.priority}
                      </span>
                    </td>
                    <td class="p-4">
                      <span class={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${
                        issue.status === 'resolved' ? 'bg-green-50 text-green-700' :
                        issue.status === 'in-progress' ? 'bg-orange-50 text-orange-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {issue.status}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleIssueSelect(issue)}
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="View & Edit"
                        >
                          <Eye class="w-4.5 h-4.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteIssue(issue._id)}
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 class="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {selectedIssue && (
        <div class="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h2 class="text-2xl font-black text-slate-900 mb-2">Review Civic Report</h2>
            <p class="text-slate-500 text-xs mb-4">ID: {selectedIssue._id}</p>

            <div class="space-y-4 mb-6">
              {selectedIssue.imageUrl && (
                <div class="h-48 rounded-xl overflow-hidden bg-slate-50">
                  <img src={selectedIssue.imageUrl} alt="Proof" class="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase">Title</h4>
                <p class="text-slate-800 font-bold text-sm mt-0.5">{selectedIssue.title}</p>
              </div>

              <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase">Description</h4>
                <p class="text-slate-600 text-sm mt-0.5 leading-relaxed">{selectedIssue.description}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <h4 class="text-xs font-bold text-slate-400 uppercase">Category</h4>
                  <p class="text-slate-800 font-semibold text-sm mt-0.5">{selectedIssue.category}</p>
                </div>
                <div>
                  <h4 class="text-xs font-bold text-slate-400 uppercase">Priority</h4>
                  <p class="text-slate-800 font-semibold text-sm mt-0.5 uppercase">{selectedIssue.priority}</p>
                </div>
              </div>

              <div>
                <h4 class="text-xs font-bold text-slate-400 uppercase">Location Address</h4>
                <p class="text-slate-600 text-sm mt-0.5">{selectedIssue.location.address || selectedIssue.location}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} class="border-t border-slate-100 pt-4 space-y-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1.5">Action Status</label>
                <div class="flex gap-3">
                  {['pending', 'in-progress', 'resolved'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewStatus(st)}
                      class={`flex-1 py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-xl border text-center transition ${
                        newStatus === st ?
                        'bg-blue-600 border-blue-600 text-white shadow-md' :
                        'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-1">Remarks & Updates</label>
                <textarea
                  rows="2"
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  class="block w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition"
                  placeholder="Add resolution details or updates..."
                ></textarea>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedIssue(null)}
                  class="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold px-4.5 py-2.5 rounded-xl text-sm transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm shadow transition disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
