import { createRoot } from 'react-dom/client';
import { StrictMode, use, useState } from 'react';
import { Login } from './Login';
import { Header } from './Header';
import { SignUp } from './Signup';
import { UserProfile } from './UserProfile';

type Page = 'login' | 'signup' | 'profile';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  return (
    <StrictMode>
      <div>
        <Header />
        <nav style={{ margin: '1rem 0' }}>
          <button onClick={() => setCurrentPage('login')}>Login</button>
          <button
            onClick={() => setCurrentPage('signup')}
            style={{ marginLeft: '0.5rem' }}
          >
            Sign Up
          </button>
          <button
            onClick={() => setCurrentPage('profile')}
            style={{ marginLeft: '0.5rem' }}
          >
            Profile
          </button>
        </nav>

        {currentPage === 'login' && (
          <Login onLoginSuccess={() => setCurrentPage('profile')} />
        )}

        {currentPage === 'signup' && (
          <SignUp onSignUpSuccess={() => setCurrentPage('login')} />
        )}

        {currentPage === 'profile' && <UserProfile />}
      </div>
    </StrictMode>
  );
};

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
root.render(<App />);
