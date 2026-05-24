import { Dispatch, SetStateAction } from 'react';
import { Login } from './login/Login';
import { SignUp } from './login/Signup';
import { UserProfile } from './profile/UserProfile';
import { Page } from './types/Page';

interface PageNavigationProps {
  currentPage: Page;
  setCurrentPage: Dispatch<SetStateAction<Page>>;
}

export const PageNavigation = ({ currentPage, setCurrentPage }: PageNavigationProps) => {
  return (
    <>
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
    </>
  );
};
