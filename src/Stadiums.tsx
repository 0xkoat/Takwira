export interface Stadium {
  name: string;
  ownerName: string;
  ownerNumber: string;
  city: string;
  locationURL: string;
  imageUrl: string[];
  principalImageUrl: string;
  price: string;
  placesNum: string;
}

// dummy stadiums

export const ALL_STADIUMS: Stadium[] = [
  {
    name: 'mouelhi',
    ownerName: 'koat',
    ownerNumber: '12345678',
    city: 'tunis',
    locationURL: 'https://google.com',
    imageUrl: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    principalImageUrl: 'https://via.placeholder.com/150',
    price: '100',
    placesNum: '11',
  },
  {
    name: 'korbi',
    ownerName: 'koat',
    ownerNumber: '12345678',
    city: 'tunis',
    locationURL: 'https://google.com',
    imageUrl: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    principalImageUrl: 'https://via.placeholder.com/150',
    price: '100',
    placesNum: '11',
  },
  {
    name: 'vedetto',
    ownerName: 'koat',
    ownerNumber: '12345678',
    city: 'tunis',
    locationURL: 'https://google.com',
    imageUrl: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    principalImageUrl: 'https://via.placeholder.com/150',
    price: '100',
    placesNum: '11',
  },
];

interface StadiumCardProps {
  stadium: Stadium;
}

function StadiumCard({ stadium }: StadiumCardProps) {
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
          <span className="text-gray-400">Price:</span> {stadium.price} TND
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

interface StadiumsListProps {
  stadiums: Stadium[];
}

export function StadiumsList({ stadiums }: StadiumsListProps) {
  return (
    <section className="py-8 px-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Available Stadiums</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stadiums.map((stadium, idx) => (
          <StadiumCard key={idx} stadium={stadium} />
        ))}
      </div>
    </section>
  );
}
