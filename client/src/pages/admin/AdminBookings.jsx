import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings } from '../../store/slices/adminSlice';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function AdminBookings() {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.admin);

  useEffect(() => { dispatch(fetchAllBookings()); }, [dispatch]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/bookings/${id}/status`, { status });
      toast.success('Status updated');
      dispatch(fetchAllBookings());
    } catch (err) {
      toast.error('Failed');
    }
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Package</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">People</th>
                <th className="text-left p-3">Total</th>
                <th className="text-left p-3">Payment</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t">
                  <td className="p-3">{b.user?.name}</td>
                  <td className="p-3">{b.package?.title}</td>
                  <td className="p-3">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="p-3">{b.numberOfPeople}</td>
                  <td className="p-3">Rs. {b.totalPrice?.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={b.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={b.status}
                      onChange={(e) => updateStatus(b._id, e.target.value)}
                      className="border rounded px-2 py-1 text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
