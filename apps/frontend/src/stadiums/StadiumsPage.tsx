import { useState, useEffect } from 'react';
import { StadiumsList } from './StadiumsList';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { UserRole, Stadium } from '@takwira/shared';


export function StadiumsPage() {
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [cityFilter, setCityFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [exactPlaces, setExactPlaces] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchStadiums = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cityFilter.trim()) params.append('city', cityFilter.trim());
    if (minPrice.trim()) params.append('minPrice', minPrice.trim());
    if (maxPrice.trim()) params.append('maxPrice', maxPrice.trim());
    if (exactPlaces.trim()) params.append('exactPlaces', exactPlaces.trim());

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stadiums?${params.toString()}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setStadiums(data);
    } catch (error) {
      console.error('Error fetching stadiums:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchStadiums();
  }, []);

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStadiums();
  };
    

  const clearFilters = () => {
    setCityFilter('');
    setMinPrice('');
    setMaxPrice('');
    setExactPlaces('');
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <section className="py-8 px-4 max-w-6xl mx-auto">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Available Stadiums
        </h2>

        <div className="flex gap-3">

          <button
            onClick={() => navigate({ to: '/profile' })}
            className="px-4 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition-all"
          >
            Profile
          </button>

          {user?.role === UserRole.StadiumOwner && (
            <button
              onClick={() => navigate({ to: '/post-stadiums' })}
              className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition-all"
            >
              Post Stadium
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-600 transition-all"
          >
            Logout
          </button>

        </div>
      </div>

      <form onSubmit={handleApplyFilters} className="bg-gray-900 border border-emerald-800/30 rounded-xl p-4 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <label className="block text-sm text-gray-300 mb-1">City</label>
            <input
              type="text"
              placeholder="e.g. Tunis"
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Min Price (TND)
            </label>
            <input
              type="number"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Max Price (TND)
            </label>
            <input
              type="number"
              placeholder="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Exact Places
            </label>
            <input
              type="number"
              placeholder="e.g. 11"
              value={exactPlaces}
              onChange={(e) => setExactPlaces(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            {loading ? 'Loading...' : `Showing ${stadiums.length} stadiums`}
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
            >
              Clear Filters
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition-all font-semibold"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </form>

      <StadiumsList stadiums={stadiums} />

      {!loading && stadiums.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No stadiums match your filters. Try adjusting them.
        </div>
      )}
    </section>
  );
}