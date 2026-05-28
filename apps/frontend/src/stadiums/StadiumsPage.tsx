import { useState, useMemo } from 'react';
import { StadiumsList } from './StadiumsList';
import { ALL_STADIUMS } from './stadiumData';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '@takwira/shared';

export function StadiumsPage() {
  const [cityFilter, setCityFilter] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [exactPlaces, setExactPlaces] = useState('');

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const filteredStadiums = useMemo(() => {
    return ALL_STADIUMS.filter((s) => {
      if (
        cityFilter.trim() !== '' &&
        !s.city.toLowerCase().includes(cityFilter.trim().toLowerCase())
      ) {
        return false;
      }

      const price = parseFloat(s.price);

      if (
        minPrice !== '' &&
        !isNaN(parseFloat(minPrice)) &&
        price < parseFloat(minPrice)
      )
        return false;

      if (
        maxPrice !== '' &&
        !isNaN(parseFloat(maxPrice)) &&
        price > parseFloat(maxPrice)
      )
        return false;

      if (exactPlaces.trim() !== '') {
        const filterPlaces = parseInt(exactPlaces, 10);
        if (isNaN(filterPlaces)) return false;

        const stadiumPlaces = parseInt(s.placesNum, 10);
        if (stadiumPlaces !== filterPlaces) return false;
      }

      return true;
    });
  }, [cityFilter, minPrice, maxPrice, exactPlaces]);

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
              onClick={() => navigate({ to: '/post-stadium' })}
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

      <div className="bg-gray-900 border border-emerald-800/30 rounded-xl p-4 mb-8 space-y-4">
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
            Showing {filteredStadiums.length} of {ALL_STADIUMS.length} stadiums
          </p>

          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <StadiumsList stadiums={filteredStadiums} />

      {filteredStadiums.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No stadiums match your filters. Try adjusting them.
        </div>
      )}
    </section>
  );
}