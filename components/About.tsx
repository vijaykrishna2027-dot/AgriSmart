import React from 'react';

const About: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <img 
              src="https://picsum.photos/600/400?image=292" 
              alt="Farmer in a field" 
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">About Us</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Agri-App is a revolutionary platform designed to empower farmers with the technology of tomorrow. We understand the challenges of modern agriculture, from battling crop diseases to navigating complex government schemes and fluctuating market prices.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our mission is to provide simple, accessible, and powerful AI-driven tools that help you make informed decisions, increase yield, and improve your livelihood. Join us in cultivating a smarter, more sustainable future for farming.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
