import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import EnhancedHeader from "./components/EnhancedHeader";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import CustomerPortal from "./pages/CustomerPortal";
import VendorPortal from "./pages/VendorPortal";
import EnhancedDashboard from "./pages/EnhancedDashboard";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function AppContent() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <EnhancedHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/customer-portal"
          element={
            <ProtectedRoute>
              <CustomerPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor-portal"
          element={
            <ProtectedRoute>
              <VendorPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <EnhancedDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;