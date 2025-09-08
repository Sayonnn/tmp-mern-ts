import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'
import { NotificationProvider } from './providers/NotificationProvider'
import { AuthProvider } from './providers/AuthProvider'
import { AppProvider } from './providers/AppProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <NotificationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificationProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
