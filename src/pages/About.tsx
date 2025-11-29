import React from 'react';
import { Award, Users, TrendingUp, Target } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { number: '9+', label: 'Years Experience' },
    { number: '150+', label: 'Countries Served' },
    { number: '10K+', label: 'Happy Clients' },
    { number: '99.8%', label: 'On-Time Delivery' }
  ];

  const values = [
    {
      icon: <Award size={40} />,
      title: 'Excellence',
      description: 'We strive for excellence in every shipment, ensuring the highest quality service through innovation and dedication.'
    },
    {
      icon: <Users size={40} />,
      title: 'Empowerment',
      description: 'We empower freight brokers with cutting-edge tools and automation, freeing them to focus on growth and relationships.'
    },
    {
      icon: <TrendingUp size={40} />,
      title: 'Innovation',
      description: 'Leveraging AI agents, automation, and modern technology to eliminate operational burdens and drive industry progress.'
    },
    {
      icon: <Target size={40} />,
      title: 'Partnership',
      description: 'Building meaningful relationships with customers and carriers through transparent, reliable, and value-driven service.'
    }
  ];

  return (
    <main className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-green-400 to-orange-400 bg-clip-text text-transparent">
            About Torchline Freight Group
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Elevating freight brokerage through innovation, automation, and empowerment
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 p-8 md:p-12 rounded-lg mb-20">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Marcus Stewart is the Owner of Torchline Freight Group and a highly experienced freight broker with nearly nine years in the industry. His journey has taken him through every mode of transport—over-dimensional freight, expedited shipments, consolidation, produce and reefer, container drayage, and more—rooting deep connections and honing his expertise across diverse sectors. Marcus has become a go-to resource for customers, known for finding tailored solutions and consistently delivering results.
            </p>
            <p>
              The mission behind Torchline Freight Group, and Marcus's own book of business, is about elevating what it means to be a freight broker. Marcus believes that brokers should be free from the repetitive operational burdens that consume their time and energy. He's focused on eliminating these daily obstacles through the strategic use of automation, AI agents, robust communication channels, strong carrier partnerships, and a commitment to innovative technology and ideas.
            </p>
            <p>
              By streamlining operations, brokers can focus on growth, building meaningful customer and carrier relationships, and bringing value back to the business. Torchline Freight Group's Agent Program is designed to be the change this industry desperately needs. It's built by brokers, for brokers, to actually help agents grow their business—not just the company's bottom line.
            </p>
            <p>
              Marcus's vision is to empower agents with the tools, resources, and support to serve clients at the highest level, while letting technology handle the busywork. By pushing for automation and scalable solutions, Torchline aims to set a new industry standard, freeing brokers to innovate and drive true progress in freight logistics.
            </p>
            <p>
              We look forward to our ongoing support from customers, carriers, and the Freight Industry and strive to provide unparallel customer experience, Agent experience, and carrier experience.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-slate-800 p-8 rounded-lg hover:bg-slate-750 transition-colors duration-200"
              >
                <div className="text-orange-400 mb-4">{value.icon}</div>
                <h3 className="text-2xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 bg-gradient-to-r from-slate-800 to-slate-750 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Experience the Torchline difference. Let us empower your freight brokerage with innovative solutions and dedicated support.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </main>
  );
};

export default About;