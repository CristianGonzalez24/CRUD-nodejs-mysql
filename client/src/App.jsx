import { Routes, Route, useLocation } from "react-router";
import { useEffect } from "react";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';
import DoctorForm from './pages/DoctorForm';
import NotFound from './pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import AppointmentPage from './pages/AppointmentPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorsPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/doctors/create" element={<DoctorForm />} />
          <Route path="/doctors/edit/:id" element={<DoctorForm />} />
        </Route>
        
        <Route path="/book-appointment" element={<AppointmentPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
