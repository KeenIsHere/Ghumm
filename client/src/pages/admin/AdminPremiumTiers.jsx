import { useEffect, useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';

export default function AdminPremiumTiers() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const loadTiers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/premium/admin/tiers');
      setTiers(data.tiers);
    } catch (err) {
      toast.error('Failed to load tiers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTiers();
  }, []);

  const startEdit = (tier) => {
    setEditingId(tier._id);
    setEditForm({
      displayName: tier.displayName,
      monthlyPrice: tier.monthlyPrice,
      annualPrice: tier.annualPrice,
      discount: tier.discount,
      priorityDays: tier.priorityDays,
      rewardMultiplier: tier.rewardMultiplier,
      exclusivePackageCount: tier.exclusivePackageCount,
      cancellationDays: tier.cancellationDays,
      insuranceIncluded: tier.insuranceIncluded,
      supportLevel: tier.supportLevel,
      features: Array.isArray(tier.features) ? tier.features.join(', ') : tier.features,
      description: tier.description,
      isActive: tier.isActive
    });
  };

  const handleSave = async () => {
    try {
      if (!editForm.displayName || !editForm.monthlyPrice || !editForm.annualPrice) {
        toast.error('Please fill required fields');
        return;
      }

      const payload = {
        ...editForm,
        monthlyPrice: Number(editForm.monthlyPrice),
        annualPrice: Number(editForm.annualPrice),
        discount: Number(editForm.discount),
        priorityDays: Number(editForm.priorityDays),
        rewardMultiplier: Number(editForm.rewardMultiplier),
        exclusivePackageCount: Number(editForm.exclusivePackageCount),
        cancellationDays: Number(editForm.cancellationDays),
        features: typeof editForm.features === 'string' 
          ? editForm.features.split(',').map(f => f.trim()).filter(Boolean) 
          : editForm.features
      };

      await API.put(`/premium/admin/tiers/${editingId}`, payload);
      toast.success('Tier updated successfully');
      setEditingId(null);
      setEditForm(null);
      loadTiers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update tier');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Premium Tier Management</h1>
          <p className="text-gray-600 mt-1">Customize pricing, discounts, and features for each tier</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {tiers.map((tier) => (
            <div key={tier._id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              {editingId === tier._id ? (
                // Edit Mode
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Display Name</label>
                      <input
                        type="text"
                        value={editForm.displayName}
                        onChange={(e) => setEditForm({ ...editForm, displayName: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Monthly Price (₹)</label>
                      <input
                        type="number"
                        value={editForm.monthlyPrice}
                        onChange={(e) => setEditForm({ ...editForm, monthlyPrice: e.target.value })}
                        min="0"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Annual Price (₹)</label>
                      <input
                        type="number"
                        value={editForm.annualPrice}
                        onChange={(e) => setEditForm({ ...editForm, annualPrice: e.target.value })}
                        min="0"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Discount (%)</label>
                      <input
                        type="number"
                        value={editForm.discount}
                        onChange={(e) => setEditForm({ ...editForm, discount: e.target.value })}
                        min="0"
                        max="100"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Priority Booking (days)</label>
                      <input
                        type="number"
                        value={editForm.priorityDays}
                        onChange={(e) => setEditForm({ ...editForm, priorityDays: e.target.value })}
                        min="0"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Reward Multiplier (x)</label>
                      <input
                        type="number"
                        value={editForm.rewardMultiplier}
                        onChange={(e) => setEditForm({ ...editForm, rewardMultiplier: e.target.value })}
                        step="0.1"
                        min="1"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Exclusive Packages Count</label>
                      <input
                        type="number"
                        value={editForm.exclusivePackageCount}
                        onChange={(e) => setEditForm({ ...editForm, exclusivePackageCount: e.target.value })}
                        min="0"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Cancellation Days</label>
                      <input
                        type="number"
                        value={editForm.cancellationDays}
                        onChange={(e) => setEditForm({ ...editForm, cancellationDays: e.target.value })}
                        min="0"
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Support Level</label>
                      <select
                        value={editForm.supportLevel}
                        onChange={(e) => setEditForm({ ...editForm, supportLevel: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                      >
                        <option value="standard">Standard</option>
                        <option value="priority">Priority</option>
                        <option value="vip">VIP</option>
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          checked={editForm.insuranceIncluded}
                          onChange={(e) => setEditForm({ ...editForm, insuranceIncluded: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Insurance Included</span>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 mt-6">
                        <input
                          type="checkbox"
                          checked={editForm.isActive}
                          onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                          className="rounded"
                        />
                        <span className="text-sm font-medium">Active</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      rows="2"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">Features (comma separated)</label>
                    <textarea
                      value={editForm.features}
                      onChange={(e) => setEditForm({ ...editForm, features: e.target.value })}
                      rows="3"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Feature 1, Feature 2, Feature 3"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                    >
                      <FiSave /> Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 flex items-center gap-2"
                    >
                      <FiX /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{tier.displayName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                    </div>
                    <button
                      onClick={() => startEdit(tier)}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
                    >
                      <FiEdit2 /> Edit
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Monthly</p>
                      <p className="font-bold text-lg">₹{tier.monthlyPrice?.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Annual</p>
                      <p className="font-bold text-lg">₹{tier.annualPrice?.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Discount</p>
                      <p className="font-bold text-lg text-green-600">{tier.discount}%</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Priority</p>
                      <p className="font-bold">{tier.priorityDays}d</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Rewards</p>
                      <p className="font-bold">{tier.rewardMultiplier}x</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-600">Support</p>
                      <p className="font-bold capitalize">{tier.supportLevel}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {tier.features?.map((feature, idx) => (
                        <span key={idx} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                          ✓ {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2 text-sm">
                    {tier.insuranceIncluded && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">Insurance ✓</span>
                    )}
                    {tier.isActive ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">Active</span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">Inactive</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
