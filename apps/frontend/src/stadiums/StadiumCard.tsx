import { Stadium } from '@takwira/shared';

interface StadiumCardProps {
  stadium: Stadium;
}

import { useNavigate } from '@tanstack/react-router';

export function StadiumCard({ stadium }: StadiumCardProps) {
  const navigate = useNavigate();
  const imageUrl = stadium.principalImageUrl?.startsWith('/uploads')
    ? `${import.meta.env.VITE_API_BASE_URL}${stadium.principalImageUrl}`
    : stadium.principalImageUrl;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate({ to: `/stadiums/${stadium.id}` })}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          navigate({ to: `/stadiums/${stadium.id}` });
        }
      }}
      className="cursor-pointer text-left bg-gray-900 border border-emerald-800/30 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-emerald-900/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
    >
      <h3 className="text-xl font-semibold text-emerald-400 px-4 pt-4 pb-2">
        {stadium.name}
      </h3>

      <img
        src={imageUrl}
        alt={stadium.name}
        className="w-full h-48 object-cover"
      />

      <div className="px-4 py-3 space-y-1 text-sm text-gray-300">
        <p>
          <span className="text-gray-400">Owner:</span> {stadium.owner?.username ?? 'Unknown'}
        </p>
        <p>
          <span className="text-gray-400">City:</span> {stadium.city}
        </p>
        <p>
          <span className="text-gray-400">Price:</span> {stadium.price} TND/hour
        </p>
        <p>
          <span className="text-gray-400">Places:</span> {stadium.placesNum}
        </p>
        {stadium.locationURL ? (
          <a
            href={stadium.locationURL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="text-emerald-400 hover:underline inline-block mt-1"
          >
            View on map
          </a>
        ) : (
          <p className="text-gray-500 italic mt-1">No location URL provided</p>
        )}
      </div>
    </div>
  );
}
