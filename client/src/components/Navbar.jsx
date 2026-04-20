import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiSettings, FiGift } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-primary-700">
            GhummGhamm
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/packages" className="text-gray-700 hover:text-primary-600 font-medium">
              Explore Packages
            </Link>
            {user ? (
              <>
                
                <Link to="/my-bookings" className="text-gray-700 hover:text-primary-600 font-medium">
                  My Bookings
                </Link>
                <Link to="/premium" className="flex items-center text-gray-700 hover:text-accent-600 font-medium">
                  <FiGift className="mr-1" /> Premium
                </Link>
                <NotificationBell />
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    <FiUser className="w-5 h-5" />
                    <span className="font-medium">{user.name}</span>
                    {user.isPremium && (
                      <span className="bg-accent-400 text-xs px-2 py-0.5 rounded-full font-semibold">
                        PRO
                      </span>
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                        <FiSettings className="mr-2" /> Profile
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
                          <MdDashboard className="mr-2" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100">
                        <FiLogOut className="mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="px-4 py-2 text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 font-medium">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700">
            {open ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

        <div className="md:hidden border-t bg-white px-4 pb-4 space-y-2">
          <Link to="/packages" onClick={() => setOpen(false)} className="block py-2 text-gray-700">
            Explore Packages
          </Link>
          {user ? (
            <>
              <Link to="/my-bookings" onClick={() => setOpen(false)} className="block py-2 text-gray-700">
                My Bookings
              </Link>
              <Link to="/premium" onClick={() => setOpen(false)} className="block py-2 text-accent-600 font-medium">
                🎁 Upgrade to Premium
              </Link>
              <Link to="/profile" onClick={() => setOpen(false)} className="block py-2 text-gray-700">
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)} className="block py-2 text-gray-700">
                  Admin Panel
                </Link>
              )}
              <button onClick={handleLogout} className="block py-2 text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="block py-2 text-primary-600">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="block py-2 text-primary-600">Register</Link>
            </>
          )}
        </div>
    </nav>
  );
}
