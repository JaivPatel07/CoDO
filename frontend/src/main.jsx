import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
// import "bootstrap/dist/css/bootstrap.min.css";
import './index.css'
import { UserProvider } from './contextAPI/userContext.jsx';



createRoot(document.getElementById('root')).render(
  <UserProvider>
    <BrowserRouter>
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </UserProvider>
)
