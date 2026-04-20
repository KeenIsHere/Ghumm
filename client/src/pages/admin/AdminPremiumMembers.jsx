import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import { FiGift, FiUsers, FiDollarSign, FiTrendingUp, FiSearch, FiFilter } from 'react-icons/fi';

export default function AdminPremiumMembers() {
  const { user } = useSelector((state) => state.auth);
  const [members, setMembers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [filters, setFilters] = useState({ tier: 'all', page: 1, search: '' });
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [extendDays, setExtendDays] = useState(30);
  const [suspendReason, setSuspendReason] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [filters, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'members') {
        const tierQuery = filters.tier !== 'all' ? `&tier=${filters.tier}` : '';
        const { data } = await API.get(
          `/premium/admin/members?page=${filters.page}&limit=10${tierQuery}`
        );
        setMembers(data.premiumMembers);
      } else if (activeTab === 'analytics') {
        const { data } = await API.get('/premium/admin/analytics');
        setAnalytics(data.analytics);
      }
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleExtendMembership = async () => {
    if (!selectedMember || !extendDays) {
      toast.error('Please enter number of days');
      return;
    }

    try {
      const { data } = await API.post('/premium/admin/extend-membership', {
        memberId: selectedMember._id,
        days: extendDays
      });

      if (data.success) {
        toast.success('✅ Membership extended successfully');
        setShowExtendModal(false);
        setSelectedMember(null);
        setExtendDays(30);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to extend membership');
    }
  };

  const handleSuspendMembership = async () => {
    if (!selectedMember) return;

    try {
      const { data } = await API.post('/premium/admin/suspend-membership', {
        memberId: selectedMember._id,
        reason: suspendReason || 'Suspended by admin'
      });

      if (data.success) {
        toast.success('✅ Membership suspended');
        setShowSuspendModal(false);
        setSelectedMember(null);
        setSuspendReason('');
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to suspend membership');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-gray-600">You don't have permission</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-accent-500 rounded-lg">
              <FiGift className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Premium Members</h1>
          </div>
          <p className="text-gray-600">Manage premium subscriptions and member benefits</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('members')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'members'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
            }`}
          >
            <FiUsers className="w-5 h-5" />
            Members List
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
            }`}
          >
            <FiTrendingUp className="w-5 h-5" />
            Analytics
          </button>
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiSearch className="inline mr-2" />
                    Search Member
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiFilter className="inline mr-2" />
                    Filter by Tier
                  </label>
                  <select
                    value={filters.tier}
                    onChange={(e) => setFilters({ ...filters, tier: e.target.value, page: 1 })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                  >
                    <option value="all">All Tiers</option>
                    <option value="silver">🥈 Silver</option>
                    <option value="gold">🥇 Gold</option>
                    <option value="platinum">👑 Platinum</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Members Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">
                  Premium Members {members.length > 0 && `(${members.length})`}
                </h2>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-600"></div>
                    <span className="text-gray-600">Loading members...</span>
                  </div>
                </div>
              ) : members.length === 0 ? (
                <div className="p-12 text-center">
                  <FiUsers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No premium members yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Member</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Tier</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Billing</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Expiry Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {members.map((member) => (
                        <tr key={member._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold text-white ${
                                member.premiumTier === 'silver'
                                  ? 'bg-gray-500'
                                  : member.premiumTier === 'gold'
                                  ? 'bg-yellow-500'
                                  : 'bg-purple-600'
                              }`}
                            >
                              {member.premiumTier === 'silver'
                                ? '🥈'
                                : member.premiumTier === 'gold'
                                ? '🥇'
                                : '👑'}{' '}
                              {member.premiumTier?.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                                member.subscriptionId?.status === 'active'
                                  ? 'bg-green-100 text-green-800'
                                  : member.subscriptionId?.status === 'suspended'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {member.subscriptionId?.status ? member.subscriptionId.status.toUpperCase() : 'INACTIVE'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded capitalize">
                              {member.subscriptionId?.billingCycle || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {new Date(member.premiumExpiry).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {Math.ceil(
                                (new Date(member.premiumExpiry) - new Date()) / (1000 * 60 * 60 * 24)
                              )}{' '}
                              days left
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedMember(member);
                                  setShowExtendModal(true);
                                }}
                                className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition text-sm"
                              >
                                Extend
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedMember(member);
                                  setShowSuspendModal(true);
                                }}
                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition text-sm"
                              >
                                Suspend
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-600"></div>
                  <span className="text-gray-600">Loading analytics...</span>
                </div>
              </div>
            ) : analytics ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Total Members</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.totalMembers}</p>
                      </div>
                      <div className="p-4 bg-primary-100 rounded-lg">
                        <FiUsers className="text-primary-600 text-2xl" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Gold Members</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {analytics.tierBreakdown.goldMembers}
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-100 rounded-lg">
                        <span className="text-2xl">🥇</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Platinum Members</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {analytics.tierBreakdown.platinumMembers}
                        </p>
                      </div>
                      <div className="p-4 bg-purple-100 rounded-lg">
                        <span className="text-2xl">👑</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-600">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Monthly Revenue</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                          ₹{analytics.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-green-100 rounded-lg">
                        <FiDollarSign className="text-green-600 text-2xl" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tier Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Members by Tier</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">🥈 Silver</span>
                          <span className="text-2xl font-bold text-gray-900">
                            {analytics.tierBreakdown.silverMembers}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (analytics.tierBreakdown.silverMembers / analytics.totalMembers) * 100 || 0
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">🥇 Gold</span>
                          <span className="text-2xl font-bold text-gray-900">
                            {analytics.tierBreakdown.goldMembers}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (analytics.tierBreakdown.goldMembers / analytics.totalMembers) * 100 || 0
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-700 font-medium">👑 Platinum</span>
                          <span className="text-2xl font-bold text-gray-900">
                            {analytics.tierBreakdown.platinumMembers}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{
                              width: `${
                                (analytics.tierBreakdown.platinumMembers / analytics.totalMembers) * 100 || 0
                              }%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Alerts & Actions</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
                        <p className="text-sm font-semibold text-orange-900">
                          ⏰ Expiring Soon ({analytics.expiringInWeek})
                        </p>
                        <p className="text-xs text-orange-700 mt-1">
                          {analytics.expiringInWeek} members' subscriptions expire within 7 days
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <p className="text-sm font-semibold text-green-900">
                          💰 Total Active Revenue
                        </p>
                        <p className="text-lg font-bold text-green-700 mt-1">
                          ₹{analytics.monthlyRevenue.toLocaleString()}/month
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-sm font-semibold text-blue-900">
                          👥 Total Premium Users
                        </p>
                        <p className="text-lg font-bold text-blue-700 mt-1">
                          {analytics.totalMembers} active members
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* Extend Membership Modal */}
        {showExtendModal && selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Extend Membership</h2>
              <p className="text-sm text-gray-600 mb-6">
                Extending premium subscription for <span className="font-semibold">{selectedMember.name}</span>
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Extend for (days)
                </label>
                <input
                  type="number"
                  value={extendDays}
                  onChange={(e) => setExtendDays(parseInt(e.target.value))}
                  min="1"
                  max="365"
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExtendModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtendMembership}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
                >
                  Extend Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Suspend Membership Modal */}
        {showSuspendModal && selectedMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Suspend Membership</h2>
              <p className="text-sm text-gray-600 mb-6">
                Suspending premium subscription for <span className="font-semibold">{selectedMember.name}</span>
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Reason (optional)
                </label>
                <textarea
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                  placeholder="Enter reason for suspension..."
                  rows="3"
                  className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                />
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <p className="text-sm text-red-800">
                  ⚠️ This will immediately revoke premium benefits for this user.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendMembership}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
