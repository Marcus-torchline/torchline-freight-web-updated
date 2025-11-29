import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, Settings, Search } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import NotificationSystem from "./NotificationSystem";

const EnhancedHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" }
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowUserMenu(false);
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center">
              <img
                src="https://d13944qc8ujj2v.cloudfront.net/projects/690ace3d51c12d69d3a46ad2/uploads/upload_1762609015551_3237"
                alt="Torchline Freight Group Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <Link to="/" className="text-xl font-bold tracking-wider text-white hover:text-orange-400 transition-colors">
              Torchline Freight Group
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <>
                <Link
                  to="/customer-portal"
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Customer Portal
                </Link>
                <Link
                  to="/vendor-portal"
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Vendor Portal
                </Link>
                
                {/* Search Icon */}
                <button className="text-gray-300 hover:text-white transition-colors duration-200">
                  <Search size={20} />
                </button>
                
                {/* Notifications */}
                <NotificationSystem />
                
                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {getUserInitials(user?.name || 'U')}
                    </div>
                    <span className="text-sm">{user?.name}</span>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-2">
                      <div className="px-4 py-2 border-b border-slate-700">
                        <p className="text-white text-sm font-semibold">{user?.name}</p>
                        <p className="text-gray-400 text-xs">{user?.email}</p>
                      </div>
                      
                      <button className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-2">
                        <User size={16} />
                        <span>Profile</span>
                      </button>
                      
                      <button className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center space-x-2">
                        <Settings size={16} />
                        <span>Settings</span>
                      </button>
                      
                      <div className="border-t border-slate-700 mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors flex items-center space-x-2"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </nav>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/customer-portal"
                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Customer Portal
                  </Link>
                  <Link
                    to="/vendor-portal"
                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Vendor Portal
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-300 hover:text-white transition-colors duration-200 font-medium text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default EnhancedHeader;