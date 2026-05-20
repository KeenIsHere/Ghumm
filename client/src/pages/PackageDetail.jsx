import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackageById, clearCurrentPackage } from '../store/slices/packageSlice';
import { FiMapPin, FiClock, FiUsers, FiStar, FiArrowUp, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import API from '../api/axios';

export default function PackageDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: pkg, loading } = useSelector((state) => state.packages);
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  useEffect(() => {
    dispatch(fetchPackageById(id));
    API.get(`/reviews/package/${id}`).then(res => setReviews(res.data.reviews)).catch(() => {});
    return () => { dispatch(clearCurrentPackage()); };
  }, [dispatch, id]);

  useEffect(() => {
    setActiveImageIndex(0);
    setTouchStartX(null);
    setTouchEndX(null);
  }, [pkg?._id]);

  if (loading || !pkg) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  // Normalise fields — support both old and new schema
  const altitude = pkg.maxAltitude || pkg.elevation || '';
  const dates = pkg.availableDates || pkg.startDates || [];
  const fallbackImg = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200';
  const coverImg = pkg.coverImage
    || (pkg.images?.length ? (typeof pkg.images[0] === 'string' ? pkg.images[0] : pkg.images[0]?.url) : null)
    || fallbackImg;
  const relatedImages = [
    coverImg,
    ...(pkg.images || [])
      .map((img) => (typeof img === 'string' ? img : img?.url))
      .filter(Boolean),
  ].filter((src, index, arr) => arr.indexOf(src) === index);
  const activeImage = relatedImages[activeImageIndex] || coverImg;

  const goToPreviousImage = () => {
    if (relatedImages.length <= 1) return;
    setActiveImageIndex((current) => (current - 1 + relatedImages.length) % relatedImages.length);
  };

  const goToNextImage = () => {
    if (relatedImages.length <= 1) return;
    setActiveImageIndex((current) => (current + 1) % relatedImages.length);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;

    const distance = touchStartX - touchEndX;
    const isSwipeEnough = Math.abs(distance) > 50;

    if (!isSwipeEnough) return;
    if (distance > 0) {
      goToNextImage();
    } else {
      goToPreviousImage();
    }
  };

  const diffBadge = {
    Easy: 'bg-green-100 text-green-700',
    Moderate: 'bg-amber-100 text-amber-700',
    Difficult: 'bg-orange-100 text-orange-700',
    Expert: 'bg-red-100 text-red-700',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero image */}
      <div className="relative rounded-2xl overflow-hidden mb-8">
        <div
          className="relative z-10"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={activeImage}
            alt={pkg.title}
            className="w-full h-[420px] object-cover"
            onError={(e) => {
              if (e.currentTarget.src !== fallbackImg) {
                e.currentTarget.src = fallbackImg;
              }
            }}
          />
          {relatedImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-black/55 transition"
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-black/40 text-white backdrop-blur-sm flex items-center justify-center hover:bg-black/55 transition"
                aria-label="Next image"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {relatedImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-2.5 rounded-full transition-all ${index === activeImageIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/60'}`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
          {pkg.trekType && (
            <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-2 border border-white/30">
              {pkg.trekType} Trek
            </span>
          )}
          <h1 className="text-4xl font-bold mb-1">{pkg.title}</h1>
          {pkg.tagline && <p className="text-gray-200 text-lg mb-2">{pkg.tagline}</p>}
          <div className="flex flex-wrap items-center gap-4 text-gray-300 text-sm">
            <span className="flex items-center gap-1"><FiMapPin className="w-3.5 h-3.5" /> {pkg.location}</span>
            <span className="flex items-center gap-1"><FiClock className="w-3.5 h-3.5" /> {pkg.duration} Days</span>
            {altitude && <span className="flex items-center gap-1"><FiArrowUp className="w-3.5 h-3.5" /> {altitude}</span>}
            {pkg.season && <span>🌤 {pkg.season}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Main content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* About */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-3">About This Trek</h2>
            <p className="text-gray-700 leading-relaxed">{pkg.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Difficulty</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${diffBadge[pkg.difficulty] || 'bg-gray-100 text-gray-600'}`}>
                  {pkg.difficulty}
                </span>
                {pkg.difficultyNote && <p className="text-xs text-gray-400 mt-1">{pkg.difficultyNote}</p>}
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Max Group</p>
                <p className="font-semibold text-sm flex items-center justify-center gap-1">
                  <FiUsers className="w-3.5 h-3.5 text-gray-400" />{pkg.maxGroupSize} people
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Season</p>
                <p className="font-semibold text-sm">{pkg.season || 'Year-round'}</p>
                {pkg.bestSeasonTip && <p className="text-xs text-gray-400 mt-1">{pkg.bestSeasonTip}</p>}
              </div>
              <div className="bg-gray-50 p-3 rounded-xl text-center">
                <p className="text-xs text-gray-500 mb-1">Rating</p>
                <p className="font-semibold text-sm flex items-center justify-center gap-1">
                  <FiStar className="text-accent-500 w-3.5 h-3.5" />
                  {pkg.averageRating || 'N/A'}
                </p>
                {pkg.totalReviews > 0 && <p className="text-xs text-gray-400">({pkg.totalReviews} reviews)</p>}
              </div>
            </div>
          </div>

          {/* Gallery strip (swipeable images) */}
          {relatedImages.length > 1 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold">Photos</h2>
                <p className="text-sm text-gray-500">Swipe or use arrows to browse related images</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {relatedImages.map((src, index) => (
                  <button
                    key={src + index}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative overflow-hidden rounded-xl border-2 transition ${index === activeImageIndex ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img
                      src={src}
                      alt={`${pkg.title} preview ${index + 1}`}
                      className="h-28 w-full object-cover"
                      onError={(e) => {
                        if (e.currentTarget.src !== fallbackImg) {
                          e.currentTarget.src = fallbackImg;
                        }
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {pkg.itinerary?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Day-by-Day Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 w-11 h-11 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center font-bold text-sm">
                      D{item.day}
                    </div>
                    <div className="flex-1 pt-1">
                      {item.title && <h3 className="font-semibold mb-0.5">{item.title}</h3>}
                      <p className="text-sm text-gray-600">{item.description}</p>
                      {item.walkingHours && (
                        <span className="inline-block mt-1.5 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          🕒 {item.walkingHours} walking
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Includes / Excludes */}
          {(pkg.includes?.length > 0 || pkg.excludes?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pkg.includes?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold mb-3 text-green-700 flex items-center gap-2">
                    <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {pkg.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pkg.excludes?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="font-bold mb-3 text-red-700 flex items-center gap-2">
                    <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs">✕</span>
                    What's Excluded
                  </h3>
                  <ul className="space-y-2">
                    {pkg.excludes.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs flex-shrink-0">✕</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Required Permits */}
          {pkg.permits?.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">🎫 Required Permits</h2>
              <div className="space-y-2">
                {pkg.permits.map((permit, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-purple-50 rounded-lg border border-purple-100">
                    <span className="font-medium text-sm text-gray-800">{permit.name}</span>
                    <span className="text-sm text-purple-700 font-medium">{permit.cost}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{r.user?.name || 'User'}</span>
                      <div className="flex items-center text-accent-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <FiStar key={i} className="fill-current w-3.5 h-3.5" />
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

        {/* ── Sidebar booking card ── */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
            <div className="text-center mb-5">
              <p className="text-3xl font-bold text-primary-700">Rs. {pkg.price?.toLocaleString()}</p>
              {pkg.priceUSD > 0 && <p className="text-gray-400 text-sm">≈ ${pkg.priceUSD} USD</p>}
              <p className="text-gray-400 text-sm mt-0.5">
                {pkg.pricingType === 'per_group' ? 'per group' : 'per person'}
              </p>
              {user?.isPremium && pkg.premiumPrice > 0 && (
                <p className="text-accent-600 text-sm font-medium mt-1">
                  Premium Price: Rs. {pkg.premiumPrice.toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-5 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Difficulty</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${diffBadge[pkg.difficulty] || ''}`}>
                  {pkg.difficulty}
                </span>
              </div>
              {pkg.trekType && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Trek type</span>
                  <span className="font-medium">{pkg.trekType}</span>
                </div>
              )}
              {altitude && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Max altitude</span>
                  <span className="font-medium">{altitude}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Available slots</span>
                <span className={`font-medium ${pkg.availableSlots < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                  {pkg.availableSlots}
                </span>
              </div>
            </div>

            {user ? (
              <Link
                to={`/book/${pkg._id}`}
                className="block text-center w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 font-semibold transition-colors"
              >
                Book Now
              </Link>
            ) : (
              <Link
                to="/login"
                className="block text-center w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 font-semibold transition-colors"
              >
                Login to Book
              </Link>
            )}

            {dates.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Available Dates</p>
                <div className="flex flex-wrap gap-2">
                  {dates.map((d, i) => (
                    <span key={i} className="text-xs bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-2.5 py-1 rounded-lg cursor-default transition-colors">
                      {new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
