import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Plane, Ship, Truck, Warehouse, FileCheck, Package, ChevronDown, ChevronUp } from 'lucide-react';

interface ServiceDetail {
  icon: JSX.Element;
  title: string;
  description: string;
  features: string[];
  expandedContent: {
    overview: string;
    details: string[];
  };
}

const Services: React.FC = () => {
  const location = useLocation();
  const [expandedService, setExpandedService] = useState<number | null>(null);

  useEffect(() => {
    if (location.state?.expandedService !== undefined) {
      setExpandedService(location.state.expandedService);
      setTimeout(() => {
        const element = document.getElementById(`service-${location.state.expandedService}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [location]);

  const services: ServiceDetail[] = [
    {
      icon: <Ship size={48} />,
      title: 'Ocean Freight',
      description: 'Cost-effective sea freight solutions for large volume shipments.',
      features: ['FCL & LCL options', 'Port-to-Port & Door-to-Door', 'Consolidation', 'Container tracking'],
      expandedContent: {
        overview: 'We can quote and offer you any type of ocean freight service needed and handle any requirements with our comprehensive maritime logistics solutions.',
        details: [
          'Large Quoting Network for FCL & LCL Options: Access to extensive carrier partnerships to find the best rates for both Full Container Load and Less than Container Load shipments, ensuring cost-effective solutions for any volume.',
          'Preferred Carriers to Offer Best Service: Strategic relationships with top-tier ocean carriers guarantee reliable transit times, excellent service quality, and competitive pricing for your international shipments.',
          'Consolidation Services: Our robust LCL carrier network enables efficient consolidation of smaller shipments, reducing costs while maintaining service quality and delivery schedules.',
          'Container Tracking for Visibility: Real-time tracking systems provide complete visibility of your containers throughout their journey, from origin port to final destination, ensuring peace of mind and proactive exception management.',
          'Port-to-Port & Door-to-Door Solutions: Flexible service options ranging from traditional port-to-port shipping to comprehensive door-to-door delivery, tailored to your specific logistics requirements.'
        ]
      }
    },
    {
      icon: <Plane size={48} />,
      title: 'Air Freight',
      description: 'Fast and reliable air cargo services for time-sensitive shipments worldwide.',
      features: ['Express delivery', 'Charter services', 'Door-to-door', 'Real-time tracking'],
      expandedContent: {
        overview: 'Our air freight services provide the speed and reliability you need for time-critical shipments, with comprehensive solutions tailored to your urgent logistics requirements.',
        details: [
          'Express Delivery Solutions: Priority air freight services with guaranteed transit times for your most urgent shipments, ensuring your cargo arrives exactly when you need it.',
          'Global Airline Network: Partnerships with major international carriers and regional airlines provide extensive route coverage and flexible scheduling options to reach any destination worldwide.',
          'Charter Services: Dedicated aircraft charter options for oversized cargo, high-value shipments, or when standard commercial flights cannot meet your specific timing or routing requirements.',
          'Door-to-Door Service: Complete end-to-end air freight solutions including pickup, customs clearance, and final delivery, eliminating the complexity of coordinating multiple service providers.',
          'Real-Time Tracking & Updates: Advanced tracking technology provides minute-by-minute visibility of your air shipments, with proactive notifications and 24/7 customer support for complete peace of mind.'
        ]
      }
    },
    {
      icon: <Truck size={48} />,
      title: 'Ground Transportation',
      description: 'Comprehensive road freight services across North America.',
      features: ['FTL & LTL', 'Cross-border', 'Last-mile delivery', 'Temperature controlled'],
      expandedContent: {
        overview: 'Our ground transportation network delivers reliable, cost-effective trucking solutions throughout North America, with specialized services to meet any shipping requirement.',
        details: [
          'Full Truckload (FTL) & Less Than Truckload (LTL): Flexible capacity options from dedicated full truckloads for large shipments to cost-effective LTL consolidation for smaller freight, optimizing your transportation spend.',
          'Cross-Border Expertise: Seamless transportation across US-Canada and US-Mexico borders with experienced customs brokerage support, ensuring smooth international ground shipments without delays.',
          'Last-Mile Delivery Solutions: Specialized final-mile delivery services ensuring your products reach their destination safely and on time, with white-glove options available for sensitive or high-value items.',
          'Temperature-Controlled Transport: Refrigerated and climate-controlled trucking for perishable goods, pharmaceuticals, and temperature-sensitive products, maintaining precise conditions throughout transit.',
          'Dedicated Fleet & Driver Network: Access to a vast network of qualified carriers and professional drivers, ensuring capacity availability and service reliability even during peak shipping seasons.'
        ]
      }
    },
    {
      icon: <Warehouse size={48} />,
      title: 'Warehousing',
      description: 'Secure storage and distribution solutions with advanced inventory management.',
      features: ['Climate controlled', 'Pick & pack', 'Inventory management', 'Distribution'],
      expandedContent: {
        overview: 'Our warehousing solutions provide secure, efficient storage and distribution services with advanced technology to optimize your supply chain operations and reduce costs.',
        details: [
          'Climate-Controlled Facilities: State-of-the-art warehouse facilities with precise temperature and humidity control for products requiring specific environmental conditions, ensuring product integrity and quality.',
          'Pick & Pack Services: Professional order fulfillment services including accurate picking, quality packing, and timely shipping preparation, streamlining your distribution operations and improving customer satisfaction.',
          'Advanced Inventory Management: Real-time inventory tracking systems with detailed reporting and analytics, providing complete visibility of stock levels, movements, and trends to optimize your inventory investment.',
          'Strategic Distribution Services: Value-added warehousing including cross-docking, kitting, labeling, and customized distribution solutions designed to accelerate your supply chain and reduce handling costs.',
          'Scalable Storage Solutions: Flexible warehousing capacity that grows with your business, from small-scale storage to large distribution centers, with short-term and long-term options available.'
        ]
      }
    },
    {
      icon: <FileCheck size={48} />,
      title: 'Customs Clearance',
      description: 'Expert customs brokerage services to ensure smooth international shipping.',
      features: ['Documentation', 'Duty calculation', 'Compliance', 'Fast processing'],
      expandedContent: {
        overview: 'Our customs brokerage expertise ensures your international shipments clear customs quickly and compliantly, minimizing delays and avoiding costly penalties.',
        details: [
          'Complete Documentation Services: Expert preparation and management of all required customs documentation including commercial invoices, packing lists, certificates of origin, and specialized permits, ensuring accuracy and compliance.',
          'Accurate Duty & Tax Calculation: Precise classification and valuation of goods to determine correct duties, taxes, and fees, leveraging our expertise to identify potential savings through trade agreements and duty reduction programs.',
          'Regulatory Compliance Expertise: In-depth knowledge of international trade regulations, import/export restrictions, and country-specific requirements, ensuring your shipments meet all legal and regulatory standards.',
          'Fast Processing & Clearance: Streamlined customs clearance processes with direct electronic filing capabilities and strong relationships with customs authorities, minimizing clearance times and preventing shipment delays.',
          'Trade Consulting Services: Strategic guidance on tariff engineering, free trade agreements, duty drawback programs, and supply chain optimization to reduce your total landed costs and improve competitiveness.'
        ]
      }
    },
    {
      icon: <Package size={48} />,
      title: 'Specialized Cargo',
      description: 'Handling of oversized, hazardous, and high-value cargo with expert care.',
      features: ['Oversized freight', 'Hazmat certified', 'High-value goods', 'Project cargo'],
      expandedContent: {
        overview: 'Our specialized cargo services provide expert handling and transportation for shipments requiring unique expertise, equipment, or security measures, ensuring safe delivery of your most challenging freight.',
        details: [
          'Oversized & Heavy Freight: Specialized equipment and routing expertise for over-dimensional cargo including machinery, construction equipment, and industrial components, with comprehensive permitting and escort services.',
          'Hazardous Materials (Hazmat): Fully certified hazmat transportation services with trained personnel, compliant packaging, proper documentation, and specialized handling procedures for dangerous goods of all classes.',
          'High-Value Goods Protection: Enhanced security measures including GPS tracking, dedicated transport, insurance coverage, and vetted carriers for valuable cargo such as electronics, pharmaceuticals, and luxury items.',
          'Project Cargo Management: End-to-end logistics coordination for complex projects requiring multiple shipments, specialized equipment, and precise timing, with dedicated project managers ensuring seamless execution.',
          'White Glove Services: Premium handling services including inside delivery, installation, debris removal, and specialized care for delicate, fragile, or high-value items requiring extra attention and expertise.'
        ]
      }
    }
  ];

  const toggleService = (index: number) => {
    setExpandedService(expandedService === index ? null : index);
  };

  return (
    <main className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-green-400 to-orange-400 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive freight and logistics solutions tailored to meet your unique business needs.
          </p>
        </div>

        <div className="space-y-6">
          {services.map((service, index) => (
            <div key={index} id={`service-${index}`} className="w-full">
              <div className={`bg-slate-800 rounded-lg overflow-hidden transition-all duration-300 ${
                expandedService === index ? 'ring-2 ring-orange-400' : ''
              }`}>
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="text-orange-400 flex-shrink-0">{service.icon}</div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
                        <p className="text-gray-400 mb-4">{service.description}</p>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {service.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center text-gray-300 text-sm">
                              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2"></span>
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleService(index)}
                      className="ml-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center space-x-2 flex-shrink-0"
                    >
                      <span>{expandedService === index ? 'Show Less' : 'Learn More'}</span>
                      {expandedService === index ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                {expandedService === index && (
                  <div className="bg-slate-750 p-8 border-t border-slate-700 animate-fadeIn">
                    <div className="max-w-6xl mx-auto">
                      <h4 className="text-2xl font-bold text-white mb-4">Detailed Overview</h4>
                      <p className="text-gray-300 mb-8 leading-relaxed text-lg">{service.expandedContent.overview}</p>
                      
                      <h4 className="text-xl font-semibold text-white mb-6">Key Capabilities:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {service.expandedContent.details.map((detail, idx) => (
                          <div key={idx} className="bg-slate-800 p-6 rounded-lg hover:bg-slate-700 transition-colors">
                            <p className="text-gray-300 leading-relaxed">{detail}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-8 border-t border-slate-700 text-center">
                        <a
                          href="/contact"
                          className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200"
                        >
                          Request a Quote for {service.title}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-slate-800 to-slate-750 p-8 rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our team of logistics experts can design a tailored solution to meet your specific requirements.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </main>
  );
};

export default Services;