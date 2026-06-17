import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Stadium } from '@takwira/shared';
import { StadiumGallery } from './StadiumGallery';
import { Route as StadiumDetailRoute } from '../routes/stadium-detail';

export function StadiumDetail() {
  const params = StadiumDetailRoute.useParams();
  const pathId = window.location.pathname.split('/').filter(Boolean).pop();
  const stadiumId = params.id ?? (pathId && pathId !== 'stadiums' ? pathId : undefined);
  const navigate = useNavigate();
  const [stadium, setStadium] = useState<Stadium | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!stadiumId) {
      setError('Invalid stadium ID');
      setLoading(false);
      return;
    }

    const fetchStadium = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/stadiums/${stadiumId}`);
        if (res.status === 401) {
          throw new Error('Unauthorized');
        }
        if (!res.ok) {
          throw new Error('Stadium not found');
        }
        const data = await res.json();
        setStadium(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stadium');
        if (err instanceof Error && err.message === 'Unauthorized') {
          localStorage.removeItem('token');
          navigate({ to: '/' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStadium();
  }, [stadiumId]);

  if (loading) {
    return <div className="p-8 text-gray-400">Loading stadium details…</div>;
  }

  if (error || !stadium) {
    return (
      <div className="p-8 text-red-400">
        {error ?? 'Unable to load stadium details.'}
      </div>
    );
  }

  const profileImageUrl = stadium.owner?.imageUrl?.startsWith('/uploads')
    ? `${import.meta.env.VITE_API_BASE_URL}${stadium.owner.imageUrl}`
    : stadium.owner?.imageUrl;

  const stadiumImages = stadium.images?.map((img) => ({
    id: img.id,
    url: img.url.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL}${img.url}` : img.url,
  })) ?? [];

  return (
    <section className="py-8 px-4 max-w-5xl mx-auto">
      <button
        className="mb-6 rounded-xl bg-gray-800 px-4 py-2 text-sm text-emerald-300 hover:bg-gray-700 transition-all"
        onClick={() => navigate({ to: '/stadiums' })}
      >
        ← Back to stadiums
      </button>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl overflow-hidden bg-gray-900 border border-emerald-800/30 shadow-lg shadow-black/20">
            <img
              src={stadiumImages[0]?.url ?? ''}
              alt={stadium.name}
              className="w-full h-96 object-cover"
            />
          </div>

          <div className="rounded-3xl bg-gray-900 border border-emerald-800/30 p-6 shadow-lg shadow-black/20">
            <h1 className="text-3xl font-semibold text-emerald-400 mb-3">{stadium.name}</h1>
            <p className="text-gray-300 mb-4">{stadium.description ?? 'No description available.'}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-gray-800 p-4">
                <p className="text-sm text-gray-400">City</p>
                <p className="mt-1 font-semibold text-white">{stadium.city}</p>
              </div>
              <div className="rounded-2xl bg-gray-800 p-4">
                <p className="text-sm text-gray-400">Location URL</p>
                {stadium.locationURL ? (
                  <a
                    href={stadium.locationURL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-emerald-400 hover:underline"
                  >
                    Open map
                  </a>
                ) : (
                  <p className="mt-1 text-gray-500">Not provided</p>
                )}
              </div>
              <div className="rounded-2xl bg-gray-800 p-4">
                <p className="text-sm text-gray-400">Places</p>
                <p className="mt-1 font-semibold text-white">{stadium.placesNum}</p>
              </div>
              <div className="rounded-2xl bg-gray-800 p-4">
                <p className="text-sm text-gray-400">Price</p>
                <p className="mt-1 font-semibold text-white">{stadium.price} TND/hour</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-gray-900 border border-emerald-800/30 p-6 shadow-lg shadow-black/20">
            <h2 className="text-xl font-semibold text-white mb-4">Stadium Images</h2>
            <StadiumGallery
              images={stadiumImages}
              principalImageId={stadium.principalImageId}
              stadiumName={stadium.name}
            />
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-gray-900 border border-emerald-800/30 p-6 shadow-lg shadow-black/20">
            <h2 className="text-xl font-semibold text-white mb-4">Owner</h2>
            <div className="flex items-center gap-4">
              <img
                src={profileImageUrl ?? '/avatar-placeholder.png'}
                alt={stadium.owner?.username ?? 'Owner profile'}
                className="w-20 h-20 rounded-full object-cover border border-emerald-600/30"
              />
              <div>
                <p className="text-lg font-semibold text-white">{stadium.owner?.username ?? 'Unknown'}</p>
                <p className="text-gray-400">{stadium.owner?.phoneNumber ?? 'No phone'}</p>
              </div>
            </div>
          </div>

        </aside>
      </div>
    </section>
  );
}
