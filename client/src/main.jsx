import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { DoctorsProvider } from './context/DoctorsContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import NotificationContainer from './components/NotificationDisplay/NotificationContainer.jsx';
import { ToastContainer} from 'react-toastify';
import { soundConfig } from './config/soundConfig.js';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <NotificationProvider soundConfig={soundConfig}>
        <DoctorsProvider>
            <App />
            <NotificationContainer theme="light" withSound={true} soundConfig={soundConfig}/>
        </DoctorsProvider>
      </NotificationProvider>
    </AuthProvider>
    <ToastContainer position="top-right" autoClose={4000}/>
  </BrowserRouter>
);