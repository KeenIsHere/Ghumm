import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-white mb-3">GhummGhamm</h3>
          <p className="text-sm">Your gateway to amazing trekking experiences in Pokhara, Nepal. Discover, plan, and book your next adventure.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/packages" className="hover:text-white">Explore Packages</Link></li>
            <li><Link to="/register" className="hover:text-white">Register</Link></li>
            <li><Link to="/login" className="hover:text-white">Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Support</h4>
          <ul className="space-y-2 text-sm">
            <li>Email: info@ghummghamm.com</li>
            <li>Phone: +977-61-123456</li>
            <li>Pokhara, Nepal</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex space-x-4 text-sm">
            <span className="hover:text-white cursor-pointer">Facebook</span>
            <span className="hover:text-white cursor-pointer">Instagram</span>
            <span className="hover:text-white cursor-pointer">Twitter</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} GhummGhamm. All rights reserved.
      </div>
    </footer>
  );
}
