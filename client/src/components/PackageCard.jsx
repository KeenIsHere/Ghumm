import { Link } from 'react-router-dom';
import { FiStar } from 'react-icons/fi';
import WishlistButton from './WishlistButton';

export default function PackageCard({ pkg }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative">
        <img
          src={pkg.coverImage || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'}
          alt={pkg.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <WishlistButton packageId={pkg._id} className="p-2 bg-white rounded-full shadow-md hover:shadow-lg" />
          <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
            pkg.difficulty === 'Easy' ? 'bg-green-500' :
            pkg.difficulty === 'Moderate' ? 'bg-yellow-500' :
            pkg.difficulty === 'Difficult' ? 'bg-orange-500' : 'bg-red-500'
          }`}>
            {pkg.difficulty}
          </span>
        </div>
        {pkg.isPremiumOnly && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              PREMIUM
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{pkg.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{pkg.location}</p>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{pkg.description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500 space-x-3">
            <span>{pkg.duration} days</span>
            <span>|</span>
            <span>{pkg.elevation}</span>
          </div>
          {pkg.averageRating > 0 && (
            <div className="flex items-center text-sm">
              <FiStar className="text-accent-500 fill-accent-400 mr-1" />
              <span className="font-medium">{pkg.averageRating}</span>
              <span className="text-gray-400 ml-1">({pkg.totalReviews})</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-700">Rs. {pkg.price?.toLocaleString()}</span>
            <span className="text-sm text-gray-400"> /person</span>
          </div>
          <Link to={`/packages/${pkg._id}`} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
