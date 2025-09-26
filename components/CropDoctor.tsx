import React, { useState, useRef, useEffect } from 'react';
import { IdentificationResult } from '../types';
import { identifyCropOrSoil } from '../services/geminiService';
import { UploadIcon, CameraIcon, SparklesIcon, XCircleIcon } from './icons';

const base64Encode = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

const languages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Spanish', 'French', 'German', 'Mandarin'
];

const PlantIdentifier: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string>('');
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [language, setLanguage] = useState<string>('English');
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shutterSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // A simple, short shutter click sound encoded in base64 to avoid an extra network request.
    const shutterSound = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=';
    shutterSoundRef.current = new Audio(shutterSound);
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCameraOpen(false);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
      setError('');
      await handleIdentify(file);
    }
  };
  
  const handleIdentify = async (file: File) => {
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const base64Image = await base64Encode(file);
      const identification = await identifyCropOrSoil(base64Image, file.type, language);
      setResult(identification);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleUploadClick = () => fileInputRef.current?.click();

  const clearImage = () => {
      setImagePreview('');
      setResult(null);
      setError('');
      if(fileInputRef.current) fileInputRef.current.value = '';
      if (isCameraOpen) stopCamera();
      setCountdown(null); // Ensure countdown is cleared if active
  }
  
  const startCamera = async () => {
    clearImage();
    setIsCameraOpen(true);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if(videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    } catch (err) {
        setError("Could not access camera. Please check permissions.");
        setIsCameraOpen(false);
    }
  }
  
  const stopCamera = () => {
      if(videoRef.current && videoRef.current.srcObject){
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
      }
      setIsCameraOpen(false);
  }

  const takePicture = () => {
    if (!videoRef.current || countdown !== null) return;

    let count = 3;
    setCountdown(count);

    const intervalId = setInterval(() => {
        count--;
        if (count > 0) {
            setCountdown(count);
        } else {
            clearInterval(intervalId);
            setCountdown(null);
            
            const video = videoRef.current;
            if (!video) return;

            setIsCapturing(true);
            shutterSoundRef.current?.play();

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            // A slight brightness boost can help improve clarity in some lighting conditions.
            if (ctx) {
                ctx.filter = 'brightness(1.05)';
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            } else {
                canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            // Let the flash animation run
            setTimeout(() => setIsCapturing(false), 300);

            canvas.toBlob(async (blob) => {
                if (blob) {
                    // Use a higher quality setting for the JPEG output
                    const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
                    setImagePreview(URL.createObjectURL(file));
                    stopCamera();
                    await handleIdentify(file);
                }
            }, 'image/jpeg', 0.95);
        }
    }, 1000);
  };

  return (
    <section className="py-20 bg-green-50/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Crop & Soil Identifier</h2>
          <p className="text-gray-600 mt-2">Identify plants, seeds, or soil types from an image.</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <div className="mb-4">
              <label htmlFor="lang-select" className="block text-sm font-medium text-gray-700 mb-1">Result Language:</label>
              <select 
                id="lang-select"
                value={language} 
                onChange={e => setLanguage(e.target.value)}
                className="w-full bg-white text-gray-900 border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
             >
                {languages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
             </select>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
              <div className="relative group text-center border-2 border-dashed border-gray-300 rounded-lg p-4">
                {imagePreview && !isCameraOpen && <img src={imagePreview} alt="Preview" className="w-full h-auto max-h-80 object-contain rounded-lg shadow-md" />}
                {isCameraOpen && <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg"></video>}
                {!imagePreview && !isCameraOpen && <div className="text-gray-400 py-16">Image preview will appear here.</div>}
                 
                {/* Visual Indicators for Capture */}
                {isCapturing && (
                    <div className="absolute inset-0 bg-white animate-flash" style={{ pointerEvents: 'none' }}></div>
                )}
                {countdown !== null && countdown > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
                        <span className="text-white text-8xl font-bold drop-shadow-lg">{countdown}</span>
                    </div>
                )}

                {(imagePreview || isCameraOpen) && (
                    <button onClick={clearImage} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-50 hover:opacity-100 transition-opacity z-10">
                        <XCircleIcon className="w-6 h-6"/>
                    </button>
                )}
              </div>
              <div className="flex gap-4 mt-4">
                <button onClick={handleUploadClick} className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"><UploadIcon className="w-5 h-5"/> Upload</button>
                {isCameraOpen ? (
                    <button 
                        onClick={takePicture} 
                        disabled={countdown !== null}
                        className="flex-1 bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:bg-green-400 disabled:cursor-not-allowed"
                    >
                        <CameraIcon className="w-5 h-5"/> 
                        {countdown !== null ? `Taking in ${countdown}...` : 'Capture'}
                    </button>
                ) : (
                    <button onClick={startCamera} className="flex-1 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"><CameraIcon className="w-5 h-5"/> Use Camera</button>
                )}
              </div>
            </div>

            <div className="space-y-6">
                {error && <div className="text-red-500 bg-red-100 p-3 rounded-lg">{error}</div>}
                
                {isLoading && (
                    <div className="flex items-center justify-center p-8 text-gray-500">
                        <svg className="animate-spin mr-3 h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        <span>Identifying...</span>
                    </div>
                )}

                {result?.type === 'plant' && result.plant && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-green-800">{result.plant.commonName}</h3>
                            <p className="text-gray-500 italic">{result.plant.scientificName}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">Description</h4>
                            <p className="text-gray-600">{result.plant.description}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">Growing Conditions</h4>
                            <p className="text-gray-600">{result.plant.growingConditions}</p>
                        </div>
                        {result.plant.commonPestsAndDiseases && (
                            <div>
                                <h4 className="font-semibold text-gray-700">Common Pests & Diseases</h4>
                                <p className="text-gray-600">{result.plant.commonPestsAndDiseases}</p>
                            </div>
                        )}
                    </div>
                )}

                {result?.type === 'soil' && result.soil && (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-2xl font-bold text-green-800">Soil Type: {result.soil.soilType}</h3>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700">Composition</h4>
                            <p className="text-gray-600">{result.soil.composition}</p>
                        </div>
                         {result.soil.phLevel && (
                            <div>
                                <h4 className="font-semibold text-gray-700">Estimated pH Level</h4>
                                <p className="text-gray-600">{result.soil.phLevel}</p>
                            </div>
                        )}
                        {result.soil.nutrientLevels && (
                             <div>
                                <h4 className="font-semibold text-gray-700">Potential Nutrient Levels</h4>
                                <p className="text-gray-600">{result.soil.nutrientLevels}</p>
                            </div>
                        )}
                        <div>
                            <h4 className="font-semibold text-gray-700">Suitable Crops</h4>
                            <p className="text-gray-600">{result.soil.suitableCrops}</p>
                        </div>
                         <div>
                            <h4 className="font-semibold text-gray-700">Management Tips</h4>
                            <p className="text-gray-600">{result.soil.managementTips}</p>
                        </div>
                    </div>
                )}

                 {!isLoading && !result && !error && (
                    <div className="text-center text-gray-500 p-8 border border-gray-200 rounded-lg bg-gray-50">
                        <SparklesIcon className="w-10 h-10 mx-auto mb-3 text-gray-400"/>
                        <p>Identification results will appear here.</p>
                    </div>
                 )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlantIdentifier;