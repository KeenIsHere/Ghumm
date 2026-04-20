import { Link } from 'react-router-dom';

export default function PaymentFailure() {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-red-600 text-4xl">&#10007;</span>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-6">Something went wrong with your payment. Please try again.</p>
      <Link to="/my-bookings" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold">
        Back to Bookings
      </Link>
    </div>
  );
}
