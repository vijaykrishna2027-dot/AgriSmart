import React, { useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Weather from './components/GovSchemes';
import Chatbot from './components/MarketPlace';
import PlantIdentifier from './components/CropDoctor';
import JobBoard from './components/JobBoard';
import Footer from './components/Footer';

const App: React.FC = () => {
  const weatherRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const plantIdentifierRef = useRef<HTMLDivElement>(null);
  const jobBoardRef = useRef<HTMLDivElement>(null);

  const refs = {
    weather: weatherRef,
    chatbot: chatbotRef,
    plantIdentifier: plantIdentifierRef,
    jobBoard: jobBoardRef,
  };
  
  const scrollToRef = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header refs={refs} scrollToRef={scrollToRef} />
      <main>
        <Hero scrollToRef={() => scrollToRef(weatherRef)} />
        <div ref={weatherRef} className="pt-20 -mt-20">
          <Weather />
        </div>
        <div ref={chatbotRef} className="pt-20 -mt-20">
          <Chatbot />
        </div>
        <div ref={plantIdentifierRef} className="pt-20 -mt-20">
          <PlantIdentifier />
        </div>
        <div ref={jobBoardRef} className="pt-20 -mt-20">
          <JobBoard />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;