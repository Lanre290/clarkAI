import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { UserProvider } from './context/UserContext.tsx';
import ErrorBoundary from './ErrorBoundary.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer theme='light' draggable position='top-right' autoClose={1000} toastStyle={{width: 'fit-content', padding: '20px', fontSize: '19px'}}></ToastContainer>
    <UserProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
    </UserProvider>
  </StrictMode>,
)
