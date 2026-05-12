import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const emptyPkg = {
  title: '', description: '', location: 'Pokhara, Nepal', difficulty: 'Moderate',
  duration: 1, maxGroupSize: 10, price: 0, premiumPrice: 0, elevation: '',
  season: '', coverImage: '', isPremiumOnly: false, isActive: true, availableSlots: 10,
  includes: '', excludes: ''
};

export default function AdminPackages() {
  const [packages, setPackages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyPkg);
  const [imagePreview, setImagePreview] = useState(null);

  const load = async () => {
    const { data } = await API.get('/packages');
    setPackages(data.packages);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setForm({ ...form, coverImage: base64 });
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer?.files;
    if (files?.[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result;
          setForm({ ...form, coverImage: base64 });
          setImagePreview(base64);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please drop an image file');
      }
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      duration: Number(form.duration),
      maxGroupSize: Number(form.maxGroupSize),
      price: Number(form.price),
      premiumPrice: Number(form.premiumPrice),
      availableSlots: Number(form.availableSlots),
      includes: typeof form.includes === 'string' ? form.includes.split(',').map(s => s.trim()).filter(Boolean) : form.includes,
      excludes: typeof form.excludes === 'string' ? form.excludes.split(',').map(s => s.trim()).filter(Boolean) : form.excludes,
    };
    try {
      if (editing) {
        await API.put(`/packages/${editing}`, payload);
        toast.success('Package updated');
      } else {
        await API.post('/packages', payload);
        toast.success('Package created');
      }
      setShowForm(false);
      setEditing(null);
      setForm(emptyPkg);
      setImagePreview(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleEdit = (pkg) => {
    setForm({
      ...pkg,
      includes: pkg.includes?.join(', ') || '',
      excludes: pkg.excludes?.join(', ') || '',
    });
    setImagePreview(pkg.coverImage);
    setEditing(pkg._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this package?')) return;
    try {
      await API.delete(`/packages/${id}`);
      toast.success('Package deleted');
      load();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Packages</h1>
          <button
            onClick={() => { setShowForm(!showForm); setEditing(null); setForm(emptyPkg); setImagePreview(null); }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {showForm ? 'Cancel' : '+ Add Package'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Title</label><input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Location</label><input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required className="w-full border rounded-lg px-3 py-2" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows="3" className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Difficulty</label><select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })} className="w-full border rounded-lg px-3 py-2"><option>Easy</option><option>Moderate</option><option>Difficult</option><option>Expert</option></select></div>
            <div><label className="block text-sm font-medium mb-1">Duration (days)</label><input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} min="1" className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Price (Rs.)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} min="0" className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Premium Price</label><input type="number" value={form.premiumPrice} onChange={e => setForm({ ...form, premiumPrice: e.target.value })} min="0" className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Max Group Size</label><input type="number" value={form.maxGroupSize} onChange={e => setForm({ ...form, maxGroupSize: e.target.value })} min="1" className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Available Slots</label><input type="number" value={form.availableSlots} onChange={e => setForm({ ...form, availableSlots: e.target.value })} min="0" className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Elevation</label><input type="text" value={form.elevation} onChange={e => setForm({ ...form, elevation: e.target.value })} className="w-full border rounded-lg px-3 py-2" /></div>
            <div><label className="block text-sm font-medium mb-1">Season</label><input type="text" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })} className="w-full border rounded-lg px-3 py-2" /></div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Cover Image</label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary-400 transition"
                  >
                    <div className="text-center">
                      <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {imagePreview && (
                  <div className="flex-1">
                    <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                    <button 
                      type="button"
                      onClick={() => { setForm({ ...form, coverImage: '' }); setImagePreview(null); }}
                      className="mt-2 w-full px-2 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Includes (comma separated)</label><input type="text" value={form.includes} onChange={e => setForm({ ...form, includes: e.target.value })} className="w-full border rounded-lg px-3 py-2" /></div>
            <div className="md:col-span-2"><label className="block text-sm font-medium mb-1">Excludes (comma separated)</label><input type="text" value={form.excludes} onChange={e => setForm({ ...form, excludes: e.target.value })} className="w-full border rounded-lg px-3 py-2" /></div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isPremiumOnly} onChange={e => setForm({ ...form, isPremiumOnly: e.target.checked })} /> Premium Only</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                {editing ? 'Update Package' : 'Create Package'}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Location</th>
                <th className="text-left p-3">Price</th>
                <th className="text-left p-3">Duration</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3 font-medium">{p.title}</td>
                  <td className="p-3">{p.location}</td>
                  <td className="p-3">Rs. {p.price?.toLocaleString()}</td>
                  <td className="p-3">{p.duration} days</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline text-xs">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
