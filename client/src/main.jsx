import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { DoctorsProvider } from './context/DoctorsContext.jsx';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <DoctorsProvider>
      <App />
    </DoctorsProvider>
  </BrowserRouter>
);