import { Routes, Route } from "react-router";
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import DoctorsPage from './pages/DoctorsPage';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
