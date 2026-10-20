import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import AllLaptops from './pages/AllLaptops.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import CategoryPage from './pages/CategoryPage.jsx';
import Contact from './pages/Contact.jsx';
import Login from './pages/admin/Login.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import LaptopForm from './pages/admin/LaptopForm.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Routes>
        {/* Public */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/laptops" element={<><Navbar /><AllLaptops /><Footer /></>} />
        <Route path="/laptops/:slug" element={<><Navbar /><ProductDetail /><Footer /></>} />
        <Route path="/category/:category" element={<><Navbar /><CategoryPage /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/new"
          element={
            <ProtectedRoute>
              <LaptopForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <ProtectedRoute>
              <LaptopForm />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<><Navbar /><Home /><Footer /></>} />
      </Routes>
    </div>
  );
}