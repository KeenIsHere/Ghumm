import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboard } from '../../store/slices/adminSlice';
import AdminSidebar from '../../components/AdminSidebar';
import { FiUsers, FiPackage, FiBookOpen, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, recentBookings, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        {loading ? (
          <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div></div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { icon: FiUsers, label: 'Total Users', value: stats?.totalUsers || 0, color: 'bg-blue-500' },
                { icon: FiPackage, label: 'Total Packages', value: stats?.totalPackages || 0, color: 'bg-green-500' },
                { icon: FiBookOpen, label: 'Total Bookings', value: stats?.totalBookings || 0, color: 'bg-purple-500' },
                { icon: FiDollarSign, label: 'Total Revenue', value: `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`, color: 'bg-accent-500' },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{card.label}</p>
                      <p className="text-2xl font-bold mt-1">{card.value}</p>
                    </div>
                    <div className={`${card.color} p-3 rounded-lg text-white`}>
                      <card.icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-bold text-lg mb-4">Recent Bookings</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3">User</th>
                      <th className="text-left p-3">Package</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Amount</th>
                      <th className="text-left p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings?.map((b) => (
                      <tr key={b._id} className="border-t">
                        <td className="p-3">{b.user?.name}</td>
                        <td className="p-3">{b.package?.title}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            b.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                            b.status === 'completed' ? 'bg-green-100 text-green-700' :
                            b.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>{b.status}</span>
                        </td>
                        <td className="p-3">Rs. {b.totalPrice?.toLocaleString()}</td>
                        <td className="p-3">{new Date(b.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
