import { Link, useLocation } from 'react-router-dom';
import { FiGrid, FiPackage, FiUsers, FiBookOpen, FiDollarSign, FiStar, FiArrowLeft, FiGift } from 'react-icons/fi';

export default function AdminSidebar() {
  const { pathname } = useLocation();
  const links = [
    { path: '/admin', icon: FiGrid, label: 'Dashboard' },
    { path: '/admin/packages', icon: FiPackage, label: 'Packages' },
    { path: '/admin/users', icon: FiUsers, label: 'Users' },
    { path: '/admin/bookings', icon: FiBookOpen, label: 'Bookings' },
    { path: '/admin/payments', icon: FiDollarSign, label: 'Payments' },
    { path: '/admin/reviews', icon: FiStar, label: 'Reviews' },
    { path: '/admin/premium-tiers', icon: FiGift, label: 'Premium Tiers' },
    { path: '/admin/premium-requests', icon: FiGift, label: 'Premium Requests' },
    { path: '/admin/premium-members', icon: FiGift, label: 'Premium Members' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white min-h-[calc(100vh-4rem)] p-4">
      <Link to="/" className="flex items-center text-gray-400 hover:text-white text-sm mb-6">
        <FiArrowLeft className="mr-2" /> Back to Site
      </Link>
      <h2 className="text-lg font-bold mb-4 text-primary-400">Admin Panel</h2>
      <nav className="space-y-1">
        {links.map((l) => (
          <Link
            key={l.path}
            to={l.path}
            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition ${
              pathname === l.path ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <l.icon className="mr-3 w-5 h-5" />
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
