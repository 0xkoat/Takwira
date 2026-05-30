import { Stadium } from '@takwira/shared';

interface StadiumCardProps {
  stadium: Stadium;
}

export function StadiumCard({ stadium }: StadiumCardProps) {
  return (
    <div className="bg-gray-900 border border-emerald-800/30 rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:shadow-emerald-900/20 transition-all duration-300">
      <h3 className="text-xl font-semibold text-emerald-400 px-4 pt-4 pb-2">
        {stadium.name}
      </h3>

      <img
        src={stadium.principalImageUrl}
        alt={stadium.name}
        className="w-full h-48 object-cover"
      />

      <div className="px-4 py-3 space-y-1 text-sm text-gray-300">
        <p>
          <span className="text-gray-400">Owner:</span> {stadium.ownerName}
        </p>
        <p>
          <span className="text-gray-400">City:</span> {stadium.city}
        </p>
        <p>
          <span className="text-gray-400">Price:</span> {stadium.price}
        </p>
        <p>
          <span className="text-gray-400">Places:</span> {stadium.placesNum}
        </p>
        <a
          href={stadium.locationURL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:underline inline-block mt-1"
        >
          View on map
        </a>
      </div>
    </div>
  );
}
