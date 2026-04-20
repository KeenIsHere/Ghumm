import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackageById, clearCurrentPackage } from '../store/slices/packageSlice';
import { FiMapPin, FiClock, FiUsers, FiStar, FiArrowUp } from 'react-icons/fi';
import API from '../api/axios';

export default function PackageDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: pkg, loading } = useSelector((state) => state.packages);
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    dispatch(fetchPackageById(id));
    API.get(`/reviews/package/${id}`).then(res => setReviews(res.data.reviews)).catch(() => {});
    return () => { dispatch(clearCurrentPackage()); };
  }, [dispatch, id]);

  if (loading || !pkg) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Image */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <img
          src={pkg.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200'}
          alt={pkg.title}
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">{pkg.title}</h1>
          <div className="flex items-center gap-4 text-gray-200">
            <span className="flex items-center"><FiMapPin className="mr-1" /> {pkg.location}</span>
            <span className="flex items-center"><FiClock className="mr-1" /> {pkg.duration} Days</span>
            <span className="flex items-center"><FiArrowUp className="mr-1" /> {pkg.elevation}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-3">About This Trek</h2>
            <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Difficulty</p>
                <p className="font-semibold text-sm">{pkg.difficulty}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Max Group</p>
                <p className="font-semibold text-sm">{pkg.maxGroupSize} people</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Season</p>
                <p className="font-semibold text-sm">{pkg.season || 'Year-round'}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Rating</p>
                <p className="font-semibold text-sm flex items-center justify-center">
                  <FiStar className="text-accent-500 mr-1" />
                  {pkg.averageRating || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Itinerary */}
          {pkg.itinerary?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                      D{item.day}
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes / Excludes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pkg.includes?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-3 text-green-700">What's Included</h3>
                <ul className="space-y-2">
                  {pkg.includes.map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <span className="text-green-500 mr-2">&#10003;</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {pkg.excludes?.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-bold mb-3 text-red-700">What's Excluded</h3>
                <ul className="space-y-2">
                  {pkg.excludes.map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <span className="text-red-500 mr-2">&#10007;</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-500">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{r.user?.name || 'User'}</span>
                      <div className="flex items-center text-accent-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <FiStar key={i} className="fill-current w-4 h-4" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{r.comment}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-primary-700">Rs. {pkg.price?.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">per person</p>
              {user?.isPremium && pkg.premiumPrice && (
                <p className="text-accent-600 text-sm font-medium mt-1">
                  Premium Price: Rs. {pkg.premiumPrice.toLocaleString()}
                </p>
              )}
            </div>
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Difficulty</span>
                <span className="font-medium">{pkg.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Available Slots</span>
                <span className="font-medium">{pkg.availableSlots}</span>
              </div>
            </div>
            {user ? (
              <Link
                to={`/book/${pkg._id}`}
                className="block text-center w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold"
              >
                Book Now
              </Link>
            ) : (
              <Link
                to="/login"
                className="block text-center w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 font-semibold"
              >
                Login to Book
              </Link>
            )}
            {pkg.startDates?.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Available Dates:</p>
                <div className="flex flex-wrap gap-2">
                  {pkg.startDates.map((d, i) => (
                    <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {new Date(d).toLocaleDateString()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
