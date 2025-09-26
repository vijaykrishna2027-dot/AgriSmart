import React from 'react';

interface HeroProps {
  scrollToRef: () => void;
}

const Hero: React.FC<HeroProps> = ({ scrollToRef }) => {
  return (
    <section 
      className="relative h-screen bg-cover bg-center flex items-center justify-center text-white" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?q=80&w=1974&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Your AI Farming Companion</h1>
        <p className="text-lg md:text-2xl mb-8 font-light drop-shadow-md">Smarter decisions, bigger yields. Powered by AI.</p>
        <button 
          onClick={scrollToRef}
          className="bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105"
        >
          Explore Features
        </button>
      </div>
    </section>
  );
};

export default Hero;
