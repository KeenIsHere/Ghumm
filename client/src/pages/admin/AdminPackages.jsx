import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import PackageForm from './PackageForm';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const difficultyColors = {
  Easy: 'bg-green-100 text-green-700',
  Moderate: 'bg-amber-100 text-amber-700',
  Difficult: 'bg-orange-100 text-orange-700',
  Expert: 'bg-red-100 text-red-700',
};

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/packages/admin/all');
      setPackages(data.packages);
    } catch {
      try {
        const { data } = await API.get('/packages');
        setPackages(data.packages);
      } catch {
        toast.error('Failed to load packages');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package? This cannot be undone.')) return;
    try {
      await API.delete(`/packages/${id}`);
      toast.success('Package deleted');
      load();
    } catch {
      toast.error('Failed to delete package');
    }
  };

  if (showForm) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <PackageForm
          editing={editing}
          onBack={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); load(); }}
        />
      </div>
    );
  }

  const getCoverImage = (pkg) => {
    if (pkg.coverImage) return pkg.coverImage;
    if (pkg.images?.length) {
      return typeof pkg.images[0] === 'string' ? pkg.images[0] : pkg.images[0]?.url;
    }
    return null;
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Packages</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {packages.length} package{packages.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1D9E75] text-white rounded-lg hover:bg-[#178a65] font-medium transition-colors"
          >
            + Add Package
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Package</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Difficulty</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#1D9E75] mx-auto" />
                  </td>
                </tr>
              )}
              {!loading && packages.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center">
                    <div className="text-5xl mb-3">📦</div>
                    <p className="font-semibold text-gray-700 text-lg">No packages yet</p>
                    <p className="text-sm text-gray-400 mt-1">Click "Add Package" to create your first one</p>
                  </td>
                </tr>
              )}
              {!loading && packages.map((p) => {
                const cover = getCoverImage(p);
                return (
                  <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {cover ? (
                          <img src={cover} alt="" className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-gray-100" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-300 text-lg">🏔</div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{p.title}</p>
                          {p.tagline && <p className="text-xs text-gray-400 truncate max-w-[220px]">{p.tagline}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">{p.location}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">Rs. {p.price?.toLocaleString()}</p>
                      {p.priceUSD > 0 && <p className="text-xs text-gray-400">${p.priceUSD}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.duration}d</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[p.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                        {p.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium w-fit ${p.status === 'published' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {p.status || 'draft'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setEditing(p); setShowForm(true); }}
                          className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-3 py-1 text-xs bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
