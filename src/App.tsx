import { createRoot } from 'react-dom/client';
import { StrictMode, useState } from 'react';
import { Header } from './Header';
import { Login } from './Login';
import { SignUp } from './Signup';
import { UserProfile } from './UserProfile';

type Page = 'login' | 'signup' | 'profile';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  return (
    <StrictMode>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />

        {/* Navigation – sleek pill-style tabs */}
        <nav className="flex justify-center gap-2 my-6">
          {(['login', 'signup', 'profile'] as Page[]).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-5 py-2 rounded-full font-medium transition-all duration-300
                ${
                  currentPage === page
                    ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
              {page === 'login'
                ? 'Login'
                : page === 'signup'
                  ? 'Sign Up'
                  : 'Profile'}
            </button>
          ))}
        </nav>

        {/* Page content with fade-in transition */}
        <main className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-md animate-fadeIn">
            {currentPage === 'login' && (
              <Login onLoginSuccess={() => setCurrentPage('profile')} />
            )}
            {currentPage === 'signup' && (
              <SignUp onSignUpSuccess={() => setCurrentPage('login')} />
            )}
            {currentPage === 'profile' && <UserProfile />}
          </div>
        </main>
      </div>
    </StrictMode>
  );
};

// Add a simple fade-in animation (you can keep it in index.css or inline)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
  }
`;
document.head.appendChild(styleSheet);

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
root.render(<App />);
