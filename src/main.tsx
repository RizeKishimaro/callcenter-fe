import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './providers/theme-provider';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const root = document.getElementById('root')!;
const queryClient = new QueryClient();

createRoot(root).render(
  <StrictMode>

    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme='light' storageKey='bp-call-center'>
        <BrowserRouter>
          <App />
        </BrowserRouter>

      </ThemeProvider>
    </QueryClientProvider>

  </StrictMode>
);
