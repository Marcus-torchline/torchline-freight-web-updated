import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceIndex: number) => {
    navigate('/services', { state: { expandedService: serviceIndex } });
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <img
              src="https://d13944qc8ujj2v.cloudfront.net/projects/690ace3d51c12d69d3a46ad2/uploads/upload_1762609015551_3237"
              alt="Torchline Freight Group Logo"
              className="w-32 h-32 object-contain mb-4"
            />
            <p className="text-gray-400 text-sm">
              Professional freight and logistics solutions with reliable service and global reach.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <button
                  onClick={() => handleServiceClick(1)}
                  className="hover:text-white transition-colors text-left"
                >
                  Air Freight
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick(0)}
                  className="hover:text-white transition-colors text-left"
                >
                  Ocean Freight
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick(2)}
                  className="hover:text-white transition-colors text-left"
                >
                  Ground Transportation
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick(3)}
                  className="hover:text-white transition-colors text-left"
                >
                  Warehousing
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleServiceClick(4)}
                  className="hover:text-white transition-colors text-left"
                >
                  Customs Clearance
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone size={16} />
                <span>+1 720-575-3331</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail size={16} />
                <span>logistics@torchline.io</span>
              </li>
              <li className="flex items-start space-x-2 text-gray-400 text-sm">
                <MapPin size={16} className="mt-1" />
                <span>Supporting U.S.A., Canada, and areas of Mexico directly. Worldwide support through our partnerships.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Torchline Freight Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;