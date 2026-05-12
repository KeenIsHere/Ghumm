import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPayments } from '../../store/slices/adminSlice';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminPayments() {
  const dispatch = useDispatch();
  const { payments } = useSelector((state) => state.admin);

  useEffect(() => { dispatch(fetchAllPayments()); }, [dispatch]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Manage Payments</h1>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Package</th>
                <th className="text-left p-3">Amount</th>
                <th className="text-left p-3">Method</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Transaction ID</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">{p.user?.name}</td>
                  <td className="p-3">{p.booking?.package?.title || '-'}</td>
                  <td className="p-3 font-medium">Rs. {p.amount?.toLocaleString()}</td>
                  <td className="p-3 capitalize">{p.method}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      p.status === 'completed' ? 'bg-green-100 text-green-700' :
                      p.status === 'failed' ? 'bg-red-100 text-red-700' :
                      p.status === 'refunded' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-3 text-xs font-mono">{p.transactionId || '-'}</td>
                  <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
