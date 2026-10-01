import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { UserProvider } from './contextAPI/userContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  // The boundary must sit outside the router/provider so it can catch errors
  // from anywhere in the tree, including the providers themselves.
  <ErrorBoundary>
    <UserProvider>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </UserProvider>
  </ErrorBoundary>
)
