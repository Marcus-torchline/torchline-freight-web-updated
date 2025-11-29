import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Globe, Shield, Clock, Users, Award } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Truck size={40} />,
      title: 'Fast Delivery',
      description: 'Express shipping solutions with guaranteed delivery times'
    },
    {
      icon: <Globe size={40} />,
      title: 'Global Reach',
      description: 'Worldwide network covering over 150 countries'
    },
    {
      icon: <Shield size={40} />,
      title: 'Secure Transport',
      description: 'Advanced tracking and insurance for complete peace of mind'
    },
    {
      icon: <Clock size={40} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer service and real-time updates'
    }
  ];

  const whyChooseButtons = [
    {
      icon: <Users size={32} />,
      title: 'Agent Program',
      description: 'Multiple Profit Margin-Split Models designed to help agents grow their business, not just the company bottom line'
    },
    {
      icon: <Award size={32} />,
      title: 'Full Support Team',
      description: 'A dedicated team that will go above and beyond for Agents, customers, and carriers with unparalleled service'
    }
  ];

  return (
    <main>
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-green-400 to-orange-400 bg-clip-text text-transparent">
            Leading the Way in Freight Solutions
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Torchline Freight Group delivers excellence in logistics with innovative solutions, 
            reliable service, and a commitment to your success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200"
            >
              Our Services
            </Link>
            <Link
              to="/contact"
              className="bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-600 transition-all duration-200"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Torchline?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {whyChooseButtons.map((button, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-700 to-slate-800 p-8 rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl border border-slate-600"
              >
                <div className="flex items-start space-x-4">
                  <div className="text-orange-400 flex-shrink-0">{button.icon}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{button.title}</h3>
                    <p className="text-gray-300">{button.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-800 p-6 rounded-lg hover:bg-slate-750 transition-colors duration-200"
              >
                <div className="text-orange-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-slate-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Ship?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Get started with Torchline Freight Group today and experience the difference 
            professional logistics can make for your business.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
          >
            Contact Us Now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Home;