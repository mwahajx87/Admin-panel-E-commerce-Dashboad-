import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const adminBasePath = (
  import.meta.env.VITE_ADMIN_BASE_PATH || '/admin'
).replace(/\/+$/, '')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={adminBasePath || '/'}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
