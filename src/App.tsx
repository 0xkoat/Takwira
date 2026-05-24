import './index.css';
import { createRoot } from 'react-dom/client';
import { StrictMode, useState } from 'react';
import { Header } from './Header';
import { PageNavigation } from './PageNavigation';

type Page = 'login' | 'signup' | 'profile';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');

  return (
    <StrictMode>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <PageNavigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </StrictMode>
  );
};

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
root.render(<App />);
