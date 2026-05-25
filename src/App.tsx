import './index.css';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Header } from './Header';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router.tsx';

const App = () => {
  return (
    <StrictMode>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <Header />
        <RouterProvider router={router} />
      </div>
    </StrictMode>
  );
};

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
root.render(<App />);
