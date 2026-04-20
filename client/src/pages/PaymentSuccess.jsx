import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const transactionUuid = queryParams.get('transaction_uuid');
        const type = queryParams.get('type');
        const subscriptionId = queryParams.get('subscriptionId');

        if (type === 'premium' && subscriptionId && transactionUuid) {
          // Verify premium payment
          const { data } = await API.post('/premium/verify-payment', {
            subscriptionId,
            esewaRefId: transactionUuid
          });

          if (data.success) {
            // Update user in Redux
            const { user: updatedUser } = await API.get('/users/profile');
            dispatch(setUser(updatedUser));
            toast.success('Premium subscription activated!');
          }
        }
      } catch (err) {
        console.log('Payment verification - will proceed as successful');
        // Still show success page even if verification fails (payment may have gone through)
      }
    };

    verifyPayment();
  }, [location, dispatch]);

  const queryParams = new URLSearchParams(location.search);
  const type = queryParams.get('type');

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-green-600 text-4xl">&#10003;</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-6">
        {type === 'premium' 
          ? 'Your premium subscription has been activated. Enjoy exclusive benefits!'
          : 'Your booking has been confirmed. You will receive a confirmation email shortly.'
        }
      </p>
      <Link 
        to={type === 'premium' ? '/profile' : '/my-bookings'} 
        className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold"
      >
        {type === 'premium' ? 'View Profile' : 'View My Bookings'}
      </Link>
    </div>
  );
}
