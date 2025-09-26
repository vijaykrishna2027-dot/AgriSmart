import React, { useState } from 'react';
import { WeatherDay } from '../types';
import { getWeatherAndAdvice } from '../services/geminiService';
import { SearchIcon, SunIcon, CloudIcon, RainIcon } from './icons';

const WeatherIcon: React.FC<{ conditions: string }> = ({ conditions }) => {
    const cond = conditions.toLowerCase();
    if (cond.includes('rain') || cond.includes('shower')) return <RainIcon className="w-10 h-10 text-blue-500" />;
    if (cond.includes('cloud')) return <CloudIcon className="w-10 h-10 text-gray-500" />;
    if (cond.includes('sun') || cond.includes('clear')) return <SunIcon className="w-10 h-10 text-yellow-500" />;
    return <CloudIcon className="w-10 h-10 text-gray-500" />;
};

const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Spanish', 'French', 'German', 'Mandarin'
];

const getNext7Days = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const next7Days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        next7Days.push(days[date.getDay()]);
    }
    return next7Days;
};

const Weather: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [language, setLanguage] = useState<string>('English');
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchedLocation, setSearchedLocation] = useState<string>('');

  const dayNames = getNext7Days();

  const handleSearch = async () => {
    if (!location.trim()) {
      setError('Please enter a location.');
      return;
    }
    setIsLoading(true);
    setError('');
    setForecast([]);
    setSearchedLocation(location);

    try {
      const result = await getWeatherAndAdvice(location, language);
      setForecast(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Weather & Farming Advisor</h2>
          <p className="text-gray-600 mt-2">Get a 7-day forecast and AI-powered advice for your location.</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter your city or region"
              className="flex-grow p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
             <select 
                value={language} 
                onChange={e => setLanguage(e.target.value)}
                className="bg-white text-gray-900 border border-gray-300 rounded-md px-2 py-1 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
             >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
             </select>
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <SearchIcon className="w-5 h-5"/>
              )}
            </button>
          </div>
        </div>

        <div className="mt-12">
          {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg text-center max-w-3xl mx-auto">{error}</div>}
          
          {forecast.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-center mb-6">Forecast for <span className="text-green-700 capitalize">{searchedLocation}</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {forecast.map((day, index) => (
                    <div key={index} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="text-xl font-bold text-gray-800">{dayNames[index] || day.day}</h4>
                                <p className="text-gray-500">{day.conditions}</p>
                            </div>
                            <WeatherIcon conditions={day.conditions} />
                        </div>
                        <div className="text-center mb-4">
                            <span className="text-4xl font-bold text-gray-800">{day.highTemp}°</span>
                            <span className="text-2xl text-gray-500 ml-2">{day.lowTemp}°C</span>
                        </div>
                        <div className="mt-auto bg-green-50 p-4 rounded-md">
                            <h5 className="font-semibold text-green-800 mb-1">Advice:</h5>
                            <p className="text-green-700 text-sm">{day.advice}</p>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          )}
           {!isLoading && forecast.length === 0 && !error && (
              <div className="text-center text-gray-500 p-8 border border-gray-200 rounded-lg bg-gray-50 max-w-3xl mx-auto">
                  <p>Weather forecast and advice will be displayed here.</p>
              </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Weather;