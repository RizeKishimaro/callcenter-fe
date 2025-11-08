import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './providers/theme-provider';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import store from './store';
import { Provider } from 'react-redux';

const root = document.getElementById('root')!;
const queryClient = new QueryClient();

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='light' storageKey='bp-call-center'>
            <App />
          </ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
