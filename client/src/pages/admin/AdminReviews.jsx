import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReviews } from '../../store/slices/adminSlice';
import AdminSidebar from '../../components/AdminSidebar';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { FiStar } from 'react-icons/fi';

export default function AdminReviews() {
  const dispatch = useDispatch();
  const { reviews } = useSelector((state) => state.admin);

  useEffect(() => { dispatch(fetchAllReviews()); }, [dispatch]);

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await API.delete(`/reviews/${id}`);
      toast.success('Review deleted');
      dispatch(fetchAllReviews());
    } catch (err) {
      toast.error('Failed');
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 bg-gray-50">
        <h1 className="text-2xl font-bold mb-6">Manage Reviews</h1>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Package</th>
                <th className="text-left p-3">Rating</th>
                <th className="text-left p-3">Comment</th>
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3">{r.user?.name}</td>
                  <td className="p-3">{r.package?.title}</td>
                  <td className="p-3">
                    <div className="flex items-center text-accent-500">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <FiStar key={i} className="fill-current w-3 h-3" />
                      ))}
                    </div>
                  </td>
                  <td className="p-3 max-w-xs truncate">{r.comment}</td>
                  <td className="p-3">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button onClick={() => deleteReview(r._id)} className="text-red-600 hover:underline text-xs">Delete</button>
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
