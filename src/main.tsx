import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer theme='light' draggable position='top-center' toastStyle={{width: 'fit-content', padding: '20px', fontSize: '19px'}}></ToastContainer>
    <App />
  </StrictMode>,
)
