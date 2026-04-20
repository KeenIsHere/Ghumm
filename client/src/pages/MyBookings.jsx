import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBookings, cancelBooking } from '../store/slices/bookingSlice';
import toast from 'react-hot-toast';
import { FiHeart } from 'react-icons/fi';
import API from '../api/axios';

export default function MyBookings() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.bookings);
  const [activeTab, setActiveTab] = useState('bookings');
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [reviewForm, setReviewForm] = useState({ bookingId: '', packageId: '', rating: 5, comment: '' });
  const [showReview, setShowReview] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'favorites') {
      loadWishlist();
    }
  }, [activeTab]);

  const loadWishlist = async () => {
    setLoadingWishlist(true);
    try {
      const { data } = await API.get('/wishlist');
      setWishlist(data.wishlist);
    } catch (err) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoadingWishlist(false);
    }
  };

  const removeFromWishlist = async (packageId) => {
    try {
      await API.post('/wishlist/remove', { packageId });
      setWishlist(wishlist.filter(w => w.packageId._id !== packageId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleBookNow = (packageId) => {
    window.location.href = `/book/${packageId}`;
  };

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      dispatch(cancelBooking({ id, reason: 'Cancelled by user' }))
        .unwrap()
        .then(() => toast.success('Booking cancelled'))
        .catch((err) => toast.error(err));
    }
  };

  const handlePay = async (bookingId) => {
    try {
      const { data } = await API.post('/payments/initiate', { bookingId, method: 'esewa' });
      if (data.esewaUrl && data.esewaData) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.esewaUrl;
        Object.entries(data.esewaData).forEach(([key, val]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = val;
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      }
    } catch (err) {
      toast.error('Payment initiation failed');
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await API.post('/reviews', reviewForm);
      toast.success('Review submitted!');
      setShowReview(null);
      setReviewForm({ bookingId: '', packageId: '', rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const paymentColor = {
    unpaid: 'text-red-600',
    paid: 'text-green-600',
    refunded: 'text-gray-600',
  };

  if (loading && activeTab === 'bookings') {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>;
  }

  if (loadingWishlist && activeTab === 'favorites') {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Travel Plans</h1>
      
      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`pb-3 font-medium transition ${
            activeTab === 'bookings'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          My Bookings ({list.length})
        </button>
        <button
          onClick={() => setActiveTab('favorites')}
          className={`pb-3 font-medium transition flex items-center gap-2 ${
            activeTab === 'favorites'
              ? 'text-primary-600 border-b-2 border-primary-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FiHeart /> Favourites ({wishlist.length})
        </button>
      </div>

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <>
          {list.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No bookings yet</p>
              <p className="text-sm mt-2">Browse packages and book your first trek!</p>
            </div>
          ) : (
            <div className="space-y-4">
          {list.map((b) => (
            <div key={b._id} className="bg-white rounded-xl shadow-sm p-5 flex flex-col md:flex-row gap-4">
              <img
                src={b.package?.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=300'}
                alt={b.package?.title}
                className="w-full md:w-40 h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg">{b.package?.title}</h3>
                    <p className="text-sm text-gray-500">{b.package?.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[b.status]}`}>
                    {b.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-sm">
                  <div><span className="text-gray-500">Date:</span> {new Date(b.startDate).toLocaleDateString()}</div>
                  <div><span className="text-gray-500">People:</span> {b.numberOfPeople}</div>
                  <div><span className="text-gray-500">Total:</span> Rs. {b.totalPrice?.toLocaleString()}</div>
                  <div><span className="text-gray-500">Payment:</span> <span className={paymentColor[b.paymentStatus]}>{b.paymentStatus}</span></div>
                </div>
                <div className="flex gap-2 mt-3">
                  {b.status === 'pending' && b.paymentStatus === 'unpaid' && (
                    <button onClick={() => handlePay(b._id)} className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                      Pay Now
                    </button>
                  )}
                  {b.status !== 'cancelled' && b.status !== 'completed' && (
                    <button onClick={() => handleCancel(b._id)} className="px-4 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">
                      Cancel
                    </button>
                  )}
                  {(b.status === 'confirmed' || b.status === 'completed') && (
                    <button
                      onClick={() => { setShowReview(b._id); setReviewForm({ bookingId: b._id, packageId: b.package?._id, rating: 5, comment: '' }); }}
                      className="px-4 py-1.5 bg-accent-100 text-accent-700 rounded-lg text-sm hover:bg-accent-200"
                    >
                      Write Review
                    </button>
                  )}
                </div>
                {showReview === b._id && (
                  <form onSubmit={submitReview} className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex gap-4 mb-3">
                      <select
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                        className="border rounded px-3 py-1.5"
                      >
                        {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>)}
                      </select>
                    </div>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      rows="2"
                      placeholder="Write your review..."
                      className="w-full border rounded-lg px-3 py-2 text-sm mb-2"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm">Submit</button>
                      <button type="button" onClick={() => setShowReview(null)} className="px-4 py-1.5 bg-gray-200 rounded-lg text-sm">Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ))}
            </div>
          )}
        </>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <>
          {wishlist.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl">No favourite packages yet</p>
              <p className="text-sm mt-2">Add packages to your wishlist for future bookings!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="relative">
                    <img
                      src={item.packageId?.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'}
                      alt={item.packageId?.title}
                      className="w-full h-40 object-cover"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.packageId._id)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                    >
                      <FiHeart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{item.packageId?.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.packageId?.location}</p>
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-gray-600">{item.packageId?.duration} days</span>
                      <span className="font-semibold text-primary-600">Rs. {item.packageId?.price?.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => handleBookNow(item.packageId._id)}
                      className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
