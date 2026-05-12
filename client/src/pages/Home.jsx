import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPackages } from '../store/slices/packageSlice';
import PackageCard from '../components/PackageCard';
import { FiSearch } from 'react-icons/fi';

export default function Home() {
  const dispatch = useDispatch();
  const { list, loading, totalPages, currentPage } = useSelector((state) => state.packages);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page };
    if (search) params.search = search;
    if (difficulty) params.difficulty = difficulty;
    if (sort) params.sort = sort;
    dispatch(fetchPackages(params));
  }, [dispatch, page, difficulty, sort]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = { page: 1 };
    if (search) params.search = search;
    if (difficulty) params.difficulty = difficulty;
    if (sort) params.sort = sort;
    dispatch(fetchPackages(params));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore Trekking Packages</h1>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packages..."
              className="w-full pl-10 border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            className="border rounded-lg px-4 py-2.5 outline-none"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Moderate">Moderate</option>
            <option value="Difficult">Difficult</option>
            <option value="Expert">Expert</option>
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="border rounded-lg px-4 py-2.5 outline-none"
          >
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="duration">Duration</option>
          </select>
          <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
            Search
          </button>
        </form>
      </div>

      {/* Package Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No packages found</p>
          <p className="text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg ${p === currentPage ? 'bg-primary-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
