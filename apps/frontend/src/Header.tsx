import { useAuth } from './context/AuthContext';

export function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-emerald-800/40 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-200">
            TAKWIRA
          </h1>
          <span className="text-gray-400 text-sm italic">⚽ Find your pitch</span>
        </div>
        {user && (
          <img
            src={user.imageUrl}
            alt={user.username ?? 'Profile'}
            className="w-12 h-12 rounded-full ring-2 ring-emerald-400 object-cover"
          />
        )}
      </div>
    </header>
  );
}
