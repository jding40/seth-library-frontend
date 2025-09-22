
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'



import AppRoutes from "./router";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AppRoutes />
  </StrictMode>,
)
