import { Stadium } from '@takwira/shared';
import { StadiumCard } from './StadiumCard';

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
