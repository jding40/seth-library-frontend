
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import AppRoutes from "./router";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
      </QueryClientProvider>
  </StrictMode>,
)
