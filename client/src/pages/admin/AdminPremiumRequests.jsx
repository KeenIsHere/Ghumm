import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/AdminSidebar';
import { FiCheckCircle, FiXCircle, FiClock, FiGift, FiUser, FiMail, FiCalendar } from 'react-icons/fi';

export default function AdminPremiumRequests() {
  const { user } = useSelector((state) => state.auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [approveReason, setApproveReason] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchRequests();
    }
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/premium/admin/pending-requests?status=${filter}`);
      setRequests(data.requests);
    } catch (err) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request) => {
    setSubmitting(true);
    try {
      const { data } = await API.post('/premium/admin/approve-request', {
        requestId: request._id,
        reason: approveReason
      });

      if (data.success) {
        toast.success('✅ Request approved! User will receive email notification.');
        setShowDetailModal(false);
        setSelectedRequest(null);
        setApproveReason('');
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (request) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await API.post('/premium/admin/reject-request', {
        requestId: request._id,
        rejectionReason: rejectReason
      });

      if (data.success) {
        toast.success('Request rejected. User will be notified.');
        setShowDetailModal(false);
        setSelectedRequest(null);
        setRejectReason('');
        fetchRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setSubmitting(false);
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
            <h1 className="text-3xl font-bold text-gray-900">Premium Requests</h1>
          </div>
          <p className="text-gray-600">Approve or reject user premium membership requests</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-6">
          {['pending', 'approved', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === status
                  ? 'bg-primary-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
              }`}
            >
              {status === 'pending' && <FiClock className="inline mr-2" />}
              {status === 'approved' && <FiCheckCircle className="inline mr-2" />}
              {status === 'rejected' && <FiXCircle className="inline mr-2" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-primary-600"></div>
                <span className="text-gray-600">Loading requests...</span>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="p-12 text-center">
              <FiGift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No {filter} requests</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {requests.map((request) => (
                <div key={request._id} className="p-6 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDetailModal(true);
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                            <FiUser className="text-primary-600" />
                            {request.userId.name}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <FiMail className="text-xs" />
                            {request.userId.email}
                          </p>
                        </div>
                        <span
                          className={`inline-block px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                            request.tierName === 'silver'
                              ? 'bg-gray-100 text-gray-800'
                              : request.tierName === 'gold'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {request.tierName === 'silver' && '🥈'} 
                          {request.tierName === 'gold' && '🥇'} 
                          {request.tierName === 'platinum' && '👑'} 
                          {request.tierName.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div>
                          <p className="text-gray-500">Billing Cycle</p>
                          <p className="font-semibold text-gray-900 capitalize">{request.billingCycle}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 flex items-center gap-1">
                            <FiCalendar className="text-xs" /> Requested
                          </p>
                          <p className="font-semibold text-gray-900">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {request.message && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-900">
                            <strong>Message:</strong> {request.message}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="ml-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          request.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : request.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {request.status === 'pending' && <FiClock />}
                        {request.status === 'approved' && <FiCheckCircle />}
                        {request.status === 'rejected' && <FiXCircle />}
                        {request.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl max-h-96 overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Details</h2>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">User</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.userId.name}</p>
                    <p className="text-xs text-gray-500">{selectedRequest.userId.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Tier</p>
                    <p className="font-semibold text-gray-900">{selectedRequest.tierName.toUpperCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Billing Cycle</p>
                    <p className="font-semibold text-gray-900 capitalize">{selectedRequest.billingCycle}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Requested Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedRequest.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedRequest.message && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-2">User Message:</p>
                    <p className="text-sm text-blue-800">{selectedRequest.message}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Approval Notes (Optional)
                      </label>
                      <textarea
                        value={approveReason}
                        onChange={(e) => setApproveReason(e.target.value)}
                        placeholder="Add any notes for approval..."
                        rows="2"
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rejection Reason (If rejecting)
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain why this request is being rejected..."
                        rows="2"
                        className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-red-500 focus:ring-2 focus:ring-red-100 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowDetailModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleReject(selectedRequest)}
                      disabled={submitting || !rejectReason.trim()}
                      className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
                    >
                      {submitting ? 'Processing...' : '❌ Reject'}
                    </button>
                    <button
                      onClick={() => handleApprove(selectedRequest)}
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {submitting ? 'Processing...' : '✅ Approve'}
                    </button>
                  </div>
                </>
              )}

              {selectedRequest.status === 'approved' && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-green-900">
                    ✅ Approved on {new Date(selectedRequest.approvedAt).toLocaleDateString()}
                  </p>
                  {selectedRequest.reason && (
                    <p className="text-sm text-green-800 mt-2">{selectedRequest.reason}</p>
                  )}
                </div>
              )}

              {selectedRequest.status === 'rejected' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <p className="text-sm font-semibold text-red-900">
                    ❌ Rejected on {new Date(selectedRequest.rejectedAt).toLocaleDateString()}
                  </p>
                  {selectedRequest.rejectedReason && (
                    <p className="text-sm text-red-800 mt-2">{selectedRequest.rejectedReason}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
