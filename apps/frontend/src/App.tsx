import './index.css';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';

const App = () => {
  return (
    <StrictMode>
      <div className="min-h-screen bg-gray-950 text-white flex flex-col">
        <RouterProvider router={router} />
      </div>
    </StrictMode>
  );
};

const rootElement = document.getElementById('root') as HTMLElement;
const root = createRoot(rootElement);
root.render(<App />);
