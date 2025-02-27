import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { DoctorsProvider } from './context/DoctorsContext.jsx';
import { ToastContainer} from 'react-toastify';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <DoctorsProvider>
      <App />
      <ToastContainer position="top-right" autoClose={4500}/>
    </DoctorsProvider>
  </BrowserRouter>
);