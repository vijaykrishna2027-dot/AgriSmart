import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-8 text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} AgriSmart Assistant. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;