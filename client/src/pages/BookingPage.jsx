import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackageById } from '../store/slices/packageSlice';
import { createBooking } from '../store/slices/bookingSlice';
import toast from 'react-hot-toast';
import API from '../api/axios';

export default function BookingPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: pkg } = useSelector((state) => state.packages);
  const { user } = useSelector((state) => state.auth);
  const [premiumTier, setPremiumTier] = useState(null);
  const [form, setForm] = useState({
    startDate: '',
    numberOfPeople: 1,
    contactPhone: '',
    specialRequests: '',
  });

  useEffect(() => {
    if (!pkg || pkg._id !== id) dispatch(fetchPackageById(id));
  }, [dispatch, id, pkg]);

  useEffect(() => {
    if (user?.isPremium) {
      loadUserPremiumTier();
    }
  }, [user]);

  const loadUserPremiumTier = async () => {
    try {
      const { data } = await API.get('/premium/subscription');
      if (data.tier) {
        setPremiumTier(data.tier);
      }
    } catch (err) {
      // Non-critical
    }
  };

  if (!pkg) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>;
  }

  let unitPrice = (user?.isPremium && pkg.premiumPrice) ? pkg.premiumPrice : pkg.price;
  let discount = 0;
  let discountAmount = 0;

  if (user?.isPremium && premiumTier) {
    discount = premiumTier.discount;
    discountAmount = (unitPrice * discount) / 100;
    unitPrice = unitPrice - discountAmount;
  }

  const totalPrice = unitPrice * form.numberOfPeople;
  const totalDiscountAmount = discountAmount * form.numberOfPeople;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(createBooking({
        packageId: id,
        startDate: form.startDate,
        numberOfPeople: form.numberOfPeople,
        contactPhone: form.contactPhone,
        specialRequests: form.specialRequests,
      })).unwrap();
      toast.success('Booking created successfully!');
      navigate('/my-bookings');
    } catch (err) {
      toast.error(err || 'Booking failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Book: {pkg.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
            <input
              type="number"
              value={form.numberOfPeople}
              onChange={(e) => setForm({ ...form, numberOfPeople: Math.max(1, parseInt(e.target.value) || 1) })}
              min="1"
              max={pkg.maxGroupSize}
              required
              className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
              required
              placeholder="+977-XXXXXXXXXX"
              className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
            <textarea
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
              rows="3"
              className="w-full border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Any special requirements or preferences..."
            />
          </div>
          <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold">
            Confirm Booking
          </button>
        </form>

        {/* Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Booking Summary</h3>
          <img src={pkg.coverImage} alt={pkg.title} className="w-full h-40 object-cover rounded-lg mb-4" />
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Package</span><span className="font-medium">{pkg.title}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Duration</span><span>{pkg.duration} days</span></div>
            
            {user?.isPremium && premiumTier && (
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 my-3">
                <div className="flex justify-between mb-2">
                  <span className="text-green-700 font-semibold">✓ Premium Member</span>
                  <span className="text-green-700 font-semibold">{premiumTier.discount}% OFF</span>
                </div>
                <div className="flex justify-between text-green-600 text-xs">
                  <span>Tier: {premiumTier.displayName}</span>
                  <span>Reward: {premiumTier.rewardMultiplier}x points</span>
                </div>
              </div>
            )}

            <div className="flex justify-between"><span className="text-gray-500">Price per person</span><span>{user?.isPremium && discount > 0 ? <span><s className="text-red-500">Rs. {((unitPrice + discountAmount) * form.numberOfPeople / form.numberOfPeople).toLocaleString()}</s> Rs. {unitPrice.toLocaleString()}</span> : `Rs. ${unitPrice.toLocaleString()}`}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">People</span><span>{form.numberOfPeople}</span></div>
            
            {totalDiscountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-semibold">
                <span>You Save</span>
                <span>Rs. {Math.round(totalDiscountAmount).toLocaleString()}</span>
              </div>
            )}
            
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary-700">Rs. {Math.round(totalPrice).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
