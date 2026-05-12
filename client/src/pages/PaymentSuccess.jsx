import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [verifying, setVerifying] = useState(true);
  const [paymentType, setPaymentType] = useState('booking');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const pidx = queryParams.get('pidx');
        const type = queryParams.get('type');
        const subscriptionId = queryParams.get('subscriptionId');
        const status = queryParams.get('status');

        setPaymentType(type || 'booking');

        // Handle Khalti booking payment
        if (pidx && (!type || type === 'booking')) {
          const { data } = await API.post('/payments/verify', { pidx });
          if (data.success) {
            toast.success('Payment verified successfully!');
            setVerifying(false);
          } else {
            toast.error('Payment verification failed');
            setTimeout(() => navigate('/my-bookings'), 2000);
          }
        }
        // Handle Khalti premium payment
        else if (type === 'premium' && subscriptionId && pidx) {
          const { data } = await API.post('/premium/verify-payment', {
            subscriptionId,
            khaltiPidx: pidx,
            status: status
          });

          if (data.success) {
            // Update user in Redux
            const profileRes = await API.get('/users/profile');
            dispatch(setUser(profileRes.data.user));
            toast.success('Premium subscription activated!');
            setVerifying(false);
          } else {
            toast.error('Premium verification failed');
            setTimeout(() => navigate('/premium'), 2000);
          }
        }
        // Handle cancelled payment
        else if (status === 'User canceled') {
          toast.error('Payment was cancelled');
          setTimeout(() => navigate(type === 'premium' ? '/premium' : '/my-bookings'), 2000);
        }
        // Fallback for other cases
        else {
          setVerifying(false);
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        toast.error(err.response?.data?.message || 'Payment verification failed');
        setTimeout(() => navigate(paymentType === 'premium' ? '/premium' : '/my-bookings'), 3000);
      }
    };

    verifyPayment();
  }, [location, dispatch, navigate, paymentType]);

  if (verifying) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-gray-200 border-t-primary-600 rounded-full mx-auto mb-6"></div>
        <p className="text-gray-600">Verifying payment...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-green-600 text-4xl">✓</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">
        {paymentType === 'premium' 
          ? 'Your premium subscription has been activated. Enjoy exclusive benefits!'
          : 'Your booking has been confirmed. You will receive a confirmation email shortly.'
        }
      </p>
      <Link 
        to={paymentType === 'premium' ? '/profile' : '/my-bookings'} 
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
      >
        {paymentType === 'premium' ? 'View Profile' : 'View My Bookings'}
      </Link>
    </div>
  );
}
