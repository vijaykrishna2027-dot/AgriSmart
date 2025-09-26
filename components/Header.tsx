import React, { useState } from 'react';

interface HeaderProps {
  refs: {
    weather: React.RefObject<HTMLDivElement>;
    chatbot: React.RefObject<HTMLDivElement>;
    plantIdentifier: React.RefObject<HTMLDivElement>;
    jobBoard: React.RefObject<HTMLDivElement>;
  };
  scrollToRef: (ref: React.RefObject<HTMLDivElement>) => void;
}

const Header: React.FC<HeaderProps> = ({ refs, scrollToRef }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Weather', ref: refs.weather },
    { name: 'Chatbot', ref: refs.chatbot },
    { name: 'Plant ID', ref: refs.plantIdentifier },
    { name: 'Jobs', ref: refs.jobBoard },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-green-700 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            AgriSmart
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToRef(link.ref)}
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Open menu">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <nav className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    scrollToRef(link.ref);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 hover:text-green-600 text-left py-2"
                >
                  {link.name}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;