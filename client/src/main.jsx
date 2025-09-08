import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

const root = createRoot(document.getElementById('root'))

if (PUBLISHABLE_KEY) {
  root.render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {app}
    </ClerkProvider>
  )
} else {
  console.warn('Missing Publishable Key. Running without Clerk.')
  root.render(app)
}
