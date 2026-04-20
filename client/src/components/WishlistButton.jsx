import { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../api/axios';

export default function WishlistButton({ packageId, className = '' }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWishlist();
  }, [packageId]);

  const checkWishlist = async () => {
    try {
      const { data } = await API.get(`/wishlist/check/${packageId}`);
      setIsInWishlist(data.isInWishlist);
    } catch (err) {
      // User not logged in or error
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoading(true);
    try {
      if (isInWishlist) {
        await API.post('/wishlist/remove', { packageId });
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await API.post('/wishlist/add', { packageId });
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Please login to add to wishlist');
      } else {
        toast.error(err.response?.data?.message || 'Failed to update wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={loading}
      className={`transition-all ${className} ${
        isInWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-gray-400 hover:text-red-500'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <FiHeart className={`w-6 h-6 ${isInWishlist ? 'fill-current' : ''}`} />
    </button>
  );
}
