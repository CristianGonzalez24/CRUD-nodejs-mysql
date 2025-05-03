import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { DoctorsProvider } from './context/DoctorsContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ToastContainer} from 'react-toastify';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <DoctorsProvider>
        <App />
      </DoctorsProvider>
    </AuthProvider>
    <ToastContainer position="top-right" autoClose={4000}/>
  </BrowserRouter>
);