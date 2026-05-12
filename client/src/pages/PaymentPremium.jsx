import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function PaymentPremium() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const initiatePayment = async () => {
      try {
        const { tierName, billingCycle } = location.state || {};

        if (!tierName || !billingCycle) {
          toast.error('Invalid premium tier selected');
          navigate('/premium');
          return;
        }

        // Call backend to initiate premium payment
        const { data } = await API.post('/premium/initiate-payment', {
          tierName,
          billingCycle
        });

        if (data.success && data.khaltiData && data.khaltiData.payment_url) {
          // Redirect user to Khalti payment page
          window.location.href = data.khaltiData.payment_url;
        } else {
          toast.error('Failed to initiate payment');
          navigate('/premium');
        }
      } catch (err) {
        toast.error(err.response?.data?.message || 'Payment initiation failed');
        navigate('/premium');
      }
    };

    initiatePayment();
  }, [user, location.state, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Redirecting to Payment Gateway...</h2>
        <p className="text-gray-600">You will be redirected to Khalti to complete your premium subscription payment.</p>
        <p className="text-sm text-gray-500 mt-4">Please do not close this window.</p>
      </div>
    </div>
  );
}
