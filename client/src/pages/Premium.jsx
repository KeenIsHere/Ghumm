import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function Premium() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userSubscription, setUserSubscription] = useState(null);
  const [userRequests, setUserRequests] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchTiers();
    if (user) {
      fetchUserSubscription();
      fetchUserRequests();
    }
  }, [user]);

  const fetchTiers = async () => {
    try {
      const { data } = await API.get('/premium/tiers');
      setTiers(data.tiers);
      setLoading(false);
    } catch (err) {
      toast.error('Failed to load premium tiers');
      setLoading(false);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const { data } = await API.get('/premium/subscription');
      if (data.subscription) {
        setUserSubscription(data.subscription);
      }
    } catch (err) {
      console.log('No active subscription');
    }
  };

  const fetchUserRequests = async () => {
    try {
      const { data } = await API.get('/premium/my-requests');
      setUserRequests(data.requests);
    } catch (err) {
      console.log('Could not fetch requests');
    }
  };

  const handleRequestPlan = (tier) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedTier(tier);
    setShowRequestModal(true);
  };

  const submitRequest = async () => {
    if (!selectedTier) return;

    setProcessing(true);
    try {
      const { data } = await API.post('/premium/request-plan', {
        tierName: selectedTier.name,
        billingCycle,
        message
      });

      if (data.success) {
        toast.success('✅ Request submitted! Admin will review soon.');
        setShowRequestModal(false);
        setMessage('');
        fetchUserRequests();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    } finally {
      setProcessing(false);
    }
  };

  const getRequestStatus = (tier) => {
    const request = userRequests.find(r => r.tierName === tier.name && r.status !== 'rejected');
    return request;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎁 Upgrade to Premium
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Request exclusive benefits, discounts, and priority access to amazing trekking packages
          </p>

          {/* Current Subscription Badge */}
          {userSubscription && (
            <div className="inline-block bg-green-100 border border-green-300 rounded-lg p-4 mb-8">
              <p className="text-green-800 font-semibold flex items-center gap-2 justify-center">
                <FiCheck className="text-xl" /> Current Plan: <span className="uppercase">{userSubscription.tierName}</span>
              </p>
              <p className="text-sm text-green-700">
                Valid until {new Date(userSubscription.expiryDate).toDateString()}
              </p>
            </div>
          )}

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                billingCycle === 'monthly'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                billingCycle === 'annual'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-accent-400 text-white px-2 py-1 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Tier Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => {
            const requestStatus = getRequestStatus(tier);
            return (
              <div
                key={tier._id}
                className={`rounded-2xl overflow-hidden shadow-lg transition transform hover:scale-105 ${
                  tier.name === 'platinum'
                    ? 'ring-2 ring-accent-400 md:scale-105'
                    : 'border border-gray-200'
                }`}
              >
                {/* Card Header */}
                <div
                  className={`p-6 text-white text-center ${
                    tier.name === 'silver'
                      ? 'bg-gradient-to-r from-gray-400 to-gray-600'
                      : tier.name === 'gold'
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-purple-500 to-purple-700'
                  }`}
                >
                  <h2 className="text-3xl font-bold mb-2">{tier.displayName}</h2>
                  <p className="text-sm opacity-90">{tier.description}</p>
                </div>

                {/* Card Body */}
                <div className="p-6 bg-white">
                  {/* Price */}
                  <div className="mb-6 text-center border-b pb-6">
                    <div className="text-4xl font-bold text-gray-900">
                      ₹{billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {billingCycle === 'annual'
                        ? `₹${Math.round(tier.annualPrice / 12)}/month (billed annually)`
                        : 'per month'}
                    </div>
                  </div>

                  {/* Discount Badge */}
                  <div className="mb-6 text-center">
                    <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                      {tier.discount}% Discount on All Packages
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-green-500 text-xl mt-0.5">✓</span>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Request Status Badge */}
                  {requestStatus && (
                    <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${
                      requestStatus.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : requestStatus.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {requestStatus.status === 'approved' && <FiCheck className="text-lg" />}
                      {requestStatus.status === 'pending' && <FiClock className="text-lg" />}
                      {requestStatus.status === 'rejected' && <FiAlertCircle className="text-lg" />}
                      <span className="font-semibold capitalize">
                        {requestStatus.status === 'approved' ? 'Approved! Ready to Pay' : 
                         requestStatus.status === 'pending' ? 'Pending Admin Review' :
                         'Rejected'}
                      </span>
                    </div>
                  )}

                  {/* Button */}
                  <button
                    onClick={() => {
                      if (requestStatus?.status === 'approved') {
                        // Navigate to payment
                        navigate('/payment/premium', {
                          state: {
                            tierName: tier.name,
                            billingCycle
                          }
                        });
                      } else {
                        handleRequestPlan(tier);
                      }
                    }}
                    disabled={userSubscription && userSubscription.tierName === tier.name}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      userSubscription && userSubscription.tierName === tier.name
                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        : requestStatus?.status === 'approved'
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : requestStatus?.status === 'pending'
                        ? 'bg-yellow-500 text-white cursor-not-allowed'
                        : `${
                            tier.name === 'platinum'
                              ? 'bg-accent-500 text-white hover:bg-accent-600'
                              : 'bg-primary-600 text-white hover:bg-primary-700'
                          }`
                    }`}
                  >
                    {userSubscription && userSubscription.tierName === tier.name
                      ? 'Current Plan'
                      : requestStatus?.status === 'approved'
                      ? '💳 Proceed to Payment'
                      : requestStatus?.status === 'pending'
                      ? '⏳ Pending...'
                      : 'Request Plan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-600">
                Yes! You can upgrade to a higher tier anytime. If you downgrade, the change takes effect at the end of your billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">What about cancellation?</h4>
              <p className="text-gray-600">
                Silver plans cannot be cancelled. Gold allows cancellation within 3 days. Platinum allows cancellation within 7 days of purchase.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">Do discounts apply automatically?</h4>
              <p className="text-gray-600">
                Yes! Your discount is automatically applied at checkout when you book a package.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">How do reward points work?</h4>
              <p className="text-gray-600">
                Earn points on every booking based on your tier multiplier. Redeem points for future booking discounts!
              </p>
            </div>
          </div>
        </div>

        {/* Request Modal */}
        {showRequestModal && selectedTier && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Request {selectedTier.displayName}</h2>
              <p className="text-sm text-gray-600 mb-6">
                Submit your request for admin approval. Admin will review your profile and approve within 24 hours.
              </p>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Plan:</strong> {selectedTier.displayName} - ₹{billingCycle === 'monthly' ? selectedTier.monthlyPrice : selectedTier.annualPrice} ({billingCycle})
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Optional Message (Why do you want this tier?)
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us why you want to upgrade..."
                    rows="3"
                    className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
                  />
                </div>

                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="text-xs text-yellow-900">
                    ℹ️ After approval, you'll be able to proceed with payment. You'll receive an email once reviewed.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitRequest}
                  disabled={processing}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {processing ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
