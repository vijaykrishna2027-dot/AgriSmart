import React, { useState, useEffect, useMemo } from 'react';
import { Job } from '../types';
import { translateJob } from '../services/geminiService';
import { BriefcaseIcon, PlusCircleIcon, XCircleIcon, LocationMarkerIcon } from './icons';

const initialJobs: Job[] = [
    { id: 1, title: 'Harvest Helper', location: 'Punjab, India', description: 'Need 5 experienced workers for wheat harvesting season. Accommodation provided.', contact: 'agri-jobs@example.com', originalLanguage: 'English' },
    { id: 2, title: 'सिंचाई विशेषज्ञ', location: 'महाराष्ट्र, भारत', description: 'एक बड़े अंगूर के बाग के लिए ड्रिप सिंचाई प्रणालियों का प्रबंधन करने के लिए एक विशेषज्ञ की तलाश है।', contact: 'vineyard-careers@example.com', originalLanguage: 'Hindi' },
    { id: 3, title: 'Farm Equipment Operator', location: 'Haryana, India', description: 'Experienced operator needed for tractors and combine harvesters. Seasonal position.', contact: '+91-9876543210', originalLanguage: 'English' }
];

const allLanguages = [
    'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi', 'Spanish', 'French', 'German', 'Mandarin'
];

const translations = {
    'English': {
        contactFor: 'Contact for',
        applyInfo: 'To apply or inquire about this job, please use the contact information below.',
        contactDetails: 'Contact Details:',
        applyNow: 'Apply Now',
        sendEmail: 'Send Email',
        close: 'Close',
        applicationForm: 'Application Form for',
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        message: 'Short Message (optional)',
        submitApplication: 'Submit Application',
        fieldRequired: 'This field is required.',
        invalidEmail: 'Please enter a valid email address.',
        applicationSubmitted: 'Application Submitted!',
        thankYouMessage: 'Thank you for applying. The job poster will contact you if they are interested.',
    },
    'Hindi': {
        contactFor: 'के लिए संपर्क करें',
        applyInfo: 'इस नौकरी के लिए आवेदन करने या पूछताछ करने के लिए, कृपया नीचे दी गई संपर्क जानकारी का उपयोग करें।',
        contactDetails: 'संपर्क विवरण:',
        applyNow: 'अभी आवेदन करें',
        sendEmail: 'ईमेल भेजें',
        close: 'बंद करें',
        applicationForm: 'के लिए आवेदन पत्र',
        yourName: 'आपका नाम',
        yourEmail: 'आपका ईमेल',
        message: 'संक्षिप्त संदेश (वैकल्पिक)',
        submitApplication: 'आवेदन जमा करें',
        fieldRequired: 'यह फ़ील्ड आवश्यक है।',
        invalidEmail: 'कृपया एक वैध ईमेल पता दर्ज करें।',
        applicationSubmitted: 'आवेदन जमा किया गया!',
        thankYouMessage: 'आवेदन करने के लिए धन्यवाद। यदि नौकरी पोस्टर रुचि रखता है तो वह आपसे संपर्क करेगा।',
    },
    'Spanish': {
        contactFor: 'Contacto para',
        applyInfo: 'Para postularse o consultar sobre este trabajo, utilice la información de contacto a continuación.',
        contactDetails: 'Detalles de contacto:',
        applyNow: 'Aplicar ahora',
        sendEmail: 'Enviar correo electrónico',
        close: 'Cerrar',
        applicationForm: 'Formulario de solicitud para',
        yourName: 'Tu nombre',
        yourEmail: 'Tu correo electrónico',
        message: 'Mensaje corto (opcional)',
        submitApplication: 'Enviar solicitud',
        fieldRequired: 'Este campo es obligatorio.',
        invalidEmail: 'Por favor, introduce una dirección de correo electrónico válida.',
        applicationSubmitted: '¡Solicitud enviada!',
        thankYouMessage: 'Gracias por postularte. El anunciante del trabajo se pondrá en contacto contigo si está interesado.',
    },
    'Tamil': {
        contactFor: 'தொடர்புக்கு',
        applyInfo: 'இந்த வேலைக்கு விண்ணப்பிக்க அல்லது விசாரிக்க, கீழே உள்ள தொடர்புத் தகவலைப் பயன்படுத்தவும்.',
        contactDetails: 'தொடர்பு விவரங்கள்:',
        applyNow: 'இப்போதே விண்ணப்பிக்கவும்',
        sendEmail: 'மின்னஞ்சல் அனுப்பு',
        close: 'மூடு',
        applicationForm: 'விண்ணப்பப் படிவம்',
        yourName: 'உங்கள் பெயர்',
        yourEmail: 'உங்கள் மின்னஞ்சல்',
        message: 'குறுகிய செய்தி (விருப்பமானது)',
        submitApplication: 'விண்ணப்பத்தைச் சமர்ப்பிக்கவும்',
        fieldRequired: 'இந்த புலம் தேவை.',
        invalidEmail: 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.',
        applicationSubmitted: 'விண்ணப்பம் சமர்ப்பிக்கப்பட்டது!',
        thankYouMessage: 'விண்ணப்பித்ததற்கு நன்றி. வேலை இடுகையாளர் ஆர்வமாக இருந்தால் உங்களைத் தொடர்புகொள்வார்.',
    },
    'Telugu': {
        contactFor: 'సంప్రదించండి',
        applyInfo: 'ఈ ఉద్యోగానికి దరఖాస్తు చేయడానికి లేదా విచారించడానికి, దయచేసి దిగువ సంప్రదింపు సమాచారాన్ని ఉపయోగించండి.',
        contactDetails: 'సంప్రదింపు వివరాలు:',
        applyNow: 'ఇప్పుడే దరఖాస్తు చేసుకోండి',
        sendEmail: 'ఇమెయిల్ పంపండి',
        close: 'మూసివేయండి',
        applicationForm: 'దరఖాస్తు ఫారం',
        yourName: 'మీ పేరు',
        yourEmail: 'మీ ఇమెయిల్',
        message: 'చిన్న సందేశం (ఐచ్ఛికం)',
        submitApplication: 'దరఖాస్తును సమర్పించండి',
        fieldRequired: 'ఈ ఫీల్డ్ అవసరం.',
        invalidEmail: 'దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామాను నమోదు చేయండి.',
        applicationSubmitted: 'దరఖాస్తు సమర్పించబడింది!',
        thankYouMessage: 'దరఖాస్తు చేసినందుకు ధన్యవాదాలు. ఉద్యోగ పోస్టర్ ఆసక్తిగా ఉంటే మిమ్మల్ని సంప్రదిస్తారు.',
    },
    'Bengali': {
        contactFor: 'যোগাযোগ করুন',
        applyInfo: 'এই চাকরিতে আবেদন করতে বা জিজ্ঞাসা করতে, অনুগ্রহ করে নীচের যোগাযোগের তথ্য ব্যবহার করুন।',
        contactDetails: 'যোগাযোগের বিবরণ:',
        applyNow: 'এখন আবেদন করুন',
        sendEmail: 'ইমেল পাঠান',
        close: 'বন্ধ করুন',
        applicationForm: 'আবেদনপত্র',
        yourName: 'আপনার নাম',
        yourEmail: 'আপনার ইমেল',
        message: 'সংক্ষিপ্ত বার্তা (ঐচ্ছিক)',
        submitApplication: 'আবেদন জমা দিন',
        fieldRequired: 'এই ক্ষেত্রটি আবশ্যক।',
        invalidEmail: 'অনুগ্রহ করে একটি বৈধ ইমেল ঠিকানা লিখুন।',
        applicationSubmitted: 'আবেদন জমা দেওয়া হয়েছে!',
        thankYouMessage: 'আবেদন করার জন্য ধন্যবাদ। চাকরির পোস্টার আগ্রহী হলে আপনার সাথে যোগাযোগ করবে।',
    },
    'Marathi': {
        contactFor: 'संपर्क साधा',
        applyInfo: 'या नोकरीसाठी अर्ज करण्यासाठी किंवा चौकशी करण्यासाठी, कृपया खालील संपर्क माहिती वापरा.',
        contactDetails: 'संपर्क तपशील:',
        applyNow: 'आता अर्ज करा',
        sendEmail: 'ईमेल पाठवा',
        close: 'बंद करा',
        applicationForm: 'अर्ज',
        yourName: 'तुमचे नाव',
        yourEmail: 'तुमचा ईमेल',
        message: 'संक्षिप्त संदेश (पर्यायी)',
        submitApplication: 'अर्ज सादर करा',
        fieldRequired: 'हे फील्ड आवश्यक आहे.',
        invalidEmail: 'कृपया वैध ईमेल पत्ता प्रविष्ट करा.',
        applicationSubmitted: 'अर्ज सादर केला!',
        thankYouMessage: 'अर्ज केल्याबद्दल धन्यवाद. नोकरी पोस्ट करणारा स्वारस्य असल्यास तुमच्याशी संपर्क साधेल.',
    },
    'Malayalam': {
        contactFor: 'ബന്ധപ്പെടുക',
        applyInfo: 'ഈ ജോലിക്ക് അപേക്ഷിക്കാനോ അന്വേഷിക്കാനോ, ദയവായി താഴെയുള്ള കോൺടാക്റ്റ് വിവരങ്ങൾ ഉപയോഗിക്കുക.',
        contactDetails: 'ബന്ധപ്പെടാനുള്ള വിവരങ്ങൾ:',
        applyNow: 'ഇപ്പോൾ അപേക്ഷിക്കുക',
        sendEmail: 'ഇമെയിൽ അയയ്ക്കുക',
        close: 'അടയ്ക്കുക',
        applicationForm: 'അപേക്ഷാ ഫോറം',
        yourName: 'നിങ്ങളുടെ പേര്',
        yourEmail: 'നിങ്ങളുടെ ഇമെയിൽ',
        message: 'ചെറിയ സന്ദേശം (ഓപ്ഷണൽ)',
        submitApplication: 'അപേക്ഷ സമർപ്പിക്കുക',
        fieldRequired: 'ഈ ഫീൽഡ് ആവശ്യമാണ്.',
        invalidEmail: 'ദയവായി ഒരു സാധുവായ ഇമെയിൽ വിലാസം നൽകുക.',
        applicationSubmitted: 'അപേക്ഷ സമർപ്പിച്ചു!',
        thankYouMessage: 'അപേക്ഷിച്ചതിന് നന്ദി. താല്പര്യമുണ്ടെങ്കിൽ തൊഴിൽദാതാവ് നിങ്ങളുമായി ബന്ധപ്പെടുന്നതാണ്.',
    },
    'Kannada': {
        contactFor: 'ಗಾಗಿ ಸಂಪರ್ಕಿಸಿ',
        applyInfo: 'ಈ ಉದ್ಯೋಗಕ್ಕಾಗಿ ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಅಥವಾ ವಿಚಾರಿಸಲು, ದಯವಿಟ್ಟು ಕೆಳಗಿನ ಸಂಪರ್ಕ ಮಾಹಿತಿಯನ್ನು ಬಳಸಿ.',
        contactDetails: 'ಸಂಪರ್ಕ ವಿವರಗಳು:',
        applyNow: 'ಈಗಲೇ ಅನ್ವಯಿಸಿ',
        sendEmail: 'ಇಮೇಲ್ ಕಳುಹಿಸಿ',
        close: 'ಮುಚ್ಚಿ',
        applicationForm: 'ಅರ್ಜಿ ನಮೂನೆ',
        yourName: 'ನಿಮ್ಮ ಹೆಸರು',
        yourEmail: 'ನಿಮ್ಮ ಇಮೇಲ್',
        message: 'ಸಣ್ಣ ಸಂದೇಶ (ಐಚ್ಛಿಕ)',
        submitApplication: 'ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿ',
        fieldRequired: 'ಈ ಕ್ಷೇತ್ರ ಅಗತ್ಯವಿದೆ.',
        invalidEmail: 'ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.',
        applicationSubmitted: 'ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಲಾಗಿದೆ!',
        thankYouMessage: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ್ದಕ್ಕಾಗಿ ಧನ್ಯವಾದಗಳು. ಉದ್ಯೋಗ ಪೋಸ್ಟರ್ ಆಸಕ್ತಿ ಹೊಂದಿದ್ದರೆ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಾರೆ.',
    },
    'Gujarati': {
        contactFor: 'માટે સંપર્ક કરો',
        applyInfo: 'આ નોકરી માટે અરજી કરવા અથવા પૂછપરછ કરવા માટે, કૃપા કરીને નીચેની સંપર્ક માહિતીનો ઉપયોગ કરો.',
        contactDetails: 'સંપર્ક વિગતો:',
        applyNow: 'હમણાં અરજી કરો',
        sendEmail: 'ઈમેલ મોકલો',
        close: 'બંધ કરો',
        applicationForm: 'અરજીપત્ર',
        yourName: 'તમારું નામ',
        yourEmail: 'તમારું ઇમેઇલ',
        message: 'ટૂંકો સંદેશ (વૈકલ્પિક)',
        submitApplication: 'અરજી સબમિટ કરો',
        fieldRequired: 'આ ક્ષેત્ર જરૂરી છે.',
        invalidEmail: 'કૃપા કરીને માન્ય ઇમેઇલ સરનામું દાખલ કરો.',
        applicationSubmitted: 'અરજી સબમિટ કરવામાં આવી!',
        thankYouMessage: 'અરજી કરવા બદલ આભાર. જોબ પોસ્ટરને રસ હશે તો તમારો સંપર્ક કરશે.',
    },
    'Punjabi': {
        contactFor: 'ਲਈ ਸੰਪਰਕ ਕਰੋ',
        applyInfo: 'ਇਸ ਨੌਕਰੀ ਲਈ ਅਰਜ਼ੀ ਦੇਣ ਜਾਂ ਪੁੱਛਗਿੱਛ ਕਰਨ ਲਈ, ਕਿਰਪਾ ਕਰਕੇ ਹੇਠਾਂ ਦਿੱਤੀ ਸੰਪਰਕ ਜਾਣਕਾਰੀ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
        contactDetails: 'ਸੰਪਰਕ ਵੇਰਵੇ:',
        applyNow: 'ਹੁਣੇ ਅਰਜ਼ੀ ਦਿਓ',
        sendEmail: 'ਈਮੇਲ ਭੇਜੋ',
        close: 'ਬੰਦ ਕਰੋ',
        applicationForm: 'ਬਿਨੈ-ਪੱਤਰ',
        yourName: 'ਤੁਹਾਡਾ ਨਾਮ',
        yourEmail: 'ਤੁਹਾਡੀ ਈਮੇਲ',
        message: 'ਛੋਟਾ ਸੁਨੇਹਾ (ਵਿਕਲਪਿਕ)',
        submitApplication: 'ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ ਕਰੋ',
        fieldRequired: 'ਇਹ ਖੇਤਰ ਲੋੜੀਂਦਾ ਹੈ।',
        invalidEmail: 'ਕਿਰਪਾ ਕਰਕੇ ਇੱਕ ਵੈਧ ਈਮੇਲ ਪਤਾ ਦਾਖਲ ਕਰੋ।',
        applicationSubmitted: 'ਅਰਜ਼ੀ ਜਮ੍ਹਾਂ ਹੋ ਗਈ!',
        thankYouMessage: 'ਅਰਜ਼ੀ ਦੇਣ ਲਈ ਤੁਹਾਡਾ ਧੰਨਵਾਦ। ਜੇਕਰ ਨੌਕਰੀ ਪੋਸਟਰ ਦਿਲਚਸਪੀ ਰੱਖਦਾ ਹੈ ਤਾਂ ਉਹ ਤੁਹਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੇਗਾ।',
    }
};


const ContactApplyModal: React.FC<{ job: Job | null; onClose: () => void }> = ({ job, onClose }) => {
    const [view, setView] = useState<'contact' | 'form' | 'submitted'>('contact');
    const [language, setLanguage] = useState<keyof typeof translations>('English');
    
    // Form state
    const [appName, setAppName] = useState('');
    const [appEmail, setAppEmail] = useState('');
    const [appMessage, setAppMessage] = useState('');
    const [formError, setFormError] = useState('');

    if (!job) return null;

    const t = translations[language] || translations['English'];
    const isEmail = job.contact.includes('@');

    const handleApplyClick = () => setView('form');
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appName.trim()) {
            setFormError(`${t.yourName} ${t.fieldRequired}`);
            return;
        }
        if (!appEmail.trim()) {
            setFormError(`${t.yourEmail} ${t.fieldRequired}`);
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(appEmail)) {
            setFormError(t.invalidEmail);
            return;
        }
        setFormError('');
        // Simulate submission
        console.log({
            jobId: job.id,
            applicantName: appName,
            applicantEmail: appEmail,
            message: appMessage
        });
        setView('submitted');
    };

    const handleClose = () => {
        onClose();
        // Reset state for next time modal opens
        setTimeout(() => {
            setView('contact');
            setAppName('');
            setAppEmail('');
            setAppMessage('');
            setFormError('');
        }, 300); // delay to allow closing animation
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full transform transition-all">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {view === 'contact' && `${t.contactFor}: ${job.title}`}
                      {view === 'form' && `${t.applicationForm}: ${job.title}`}
                      {view === 'submitted' && t.applicationSubmitted}
                    </h3>
                    <div className="flex items-center gap-4">
                         <select 
                            value={language} 
                            onChange={e => setLanguage(e.target.value as keyof typeof translations)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-green-500 focus:border-transparent"
                         >
                            {Object.keys(translations).map(lang => <option key={lang} value={lang}>{lang}</option>)}
                         </select>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            <XCircleIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
                
                {view === 'contact' && (
                    <div className="p-6">
                        <p className="text-gray-600 mb-4">{t.applyInfo}</p>
                        <div className="bg-gray-100 p-4 rounded-md mb-4">
                            <p className="text-sm text-gray-700">{t.contactDetails}</p>
                            <p className="text-lg font-semibold text-green-700 break-words">{job.contact}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                             {isEmail && (
                                <a 
                                    href={`mailto:${job.contact}?subject=Job Inquiry: ${job.title}`}
                                    className="flex-1 text-center bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    {t.sendEmail}
                                </a>
                            )}
                            <button 
                                onClick={handleApplyClick}
                                className="flex-1 text-center bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                {t.applyNow}
                            </button>
                        </div>
                    </div>
                )}

                {view === 'form' && (
                    <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t.yourName}</label>
                            <input type="text" value={appName} onChange={e => setAppName(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t.yourEmail}</label>
                            <input type="email" value={appEmail} onChange={e => setAppEmail(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">{t.message}</label>
                            <textarea value={appMessage} onChange={e => setAppMessage(e.target.value)} rows={3} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"></textarea>
                        </div>
                        {formError && <p className="text-red-500 text-sm">{formError}</p>}
                        <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">{t.submitApplication}</button>
                    </form>
                )}

                {view === 'submitted' && (
                    <div className="p-6 text-center">
                        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h4 className="text-2xl font-bold text-gray-800 mt-4">{t.applicationSubmitted}</h4>
                        <p className="text-gray-600 mt-2">{t.thankYouMessage}</p>
                        <button onClick={handleClose} className="mt-6 bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors">{t.close}</button>
                    </div>
                )}
            </div>
        </div>
    );
};


const JobBoard: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>(initialJobs);
    const [view, setView] = useState<'list' | 'form'>('list');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    // Form state
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState('');
    const [originalLanguage, setOriginalLanguage] = useState('English');
    const [error, setError] = useState('');
    
    // Translation state
    type Translation = { title: string; location: string; description: string };
    const [translationsCache, setTranslationsCache] = useState<Record<string, Translation>>({});
    const [viewLanguage, setViewLanguage] = useState('English');
    const [isTranslating, setIsTranslating] = useState(false);

    // Filter state
    const [searchTitle, setSearchTitle] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [appliedFilters, setAppliedFilters] = useState({ title: '', location: '' });

    const getJobDisplayData = (job: Job) => {
        if (job.originalLanguage === viewLanguage) return job;
        return translationsCache[job.id] || job;
    }

    useEffect(() => {
        const translateAllJobs = async () => {
            if (viewLanguage === 'English' && jobs.every(j => j.originalLanguage === 'English')) {
                 setTranslationsCache({}); // Clear cache if switching back to default
                 return;
            }

            setIsTranslating(true);
            const jobsToTranslate = jobs.filter(job => job.originalLanguage !== viewLanguage);
            
            try {
                const translationPromises = jobsToTranslate.map(job => translateJob(job, viewLanguage));
                const results = await Promise.all(translationPromises);

                const newCache: Record<string, Translation> = {};
                jobsToTranslate.forEach((job, index) => {
                    newCache[job.id] = results[index];
                });
                setTranslationsCache(prev => ({ ...prev, ...newCache }));
            } catch (e) {
                console.error("Translation failed for one or more jobs:", e);
            } finally {
                setIsTranslating(false);
            }
        };

        translateAllJobs();
    }, [viewLanguage, jobs]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title || !location || !description || !contact) {
            setError('All fields are required.');
            return;
        }
        const newJob: Job = {
            id: Date.now(),
            title, location, description, contact, originalLanguage
        };
        setJobs(prev => [newJob, ...prev]);
        setTitle('');
        setLocation('');
        setDescription('');
        setContact('');
        setError('');
        setView('list');
    };

    const handleSearch = () => {
        setAppliedFilters({ title: searchTitle, location: searchLocation });
    };

    const handleClearSearch = () => {
        setSearchTitle('');
        setSearchLocation('');
        setAppliedFilters({ title: '', location: '' });
    };

    const jobsToDisplay = useMemo(() => {
        return jobs.filter(job => {
            const displayData = getJobDisplayData(job);
            const titleMatch = appliedFilters.title ? displayData.title.toLowerCase().includes(appliedFilters.title.toLowerCase()) : true;
            const locationMatch = appliedFilters.location ? displayData.location.toLowerCase().includes(appliedFilters.location.toLowerCase()) : true;
            return titleMatch && locationMatch;
        });
    }, [jobs, appliedFilters, viewLanguage, translationsCache]);
    

    return (
    <>
    <ContactApplyModal job={selectedJob} onClose={() => setSelectedJob(null)} />
    <section 
        className="py-20 bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">Farmer Job Board</h2>
          <p className="text-white/90 mt-2 text-lg">Find and post agricultural job opportunities in your area.</p>
        </div>

        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="view-lang" className="text-white font-medium">View in:</label>
                    <select 
                        id="view-lang"
                        value={viewLanguage} 
                        onChange={e => setViewLanguage(e.target.value)}
                        className="bg-white text-gray-900 border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                        {allLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                    </select>
                </div>
                <button 
                    onClick={() => setView(view === 'list' ? 'form' : 'list')}
                    className="bg-green-600 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 transition-transform transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                    <PlusCircleIcon className="w-5 h-5"/>
                    {view === 'list' ? 'Post a Job' : 'View Jobs'}
                </button>
            </div>

            {view === 'list' && (
                 <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-6 flex flex-col sm:flex-row gap-4 items-center">
                    <input 
                        type="text" 
                        placeholder="Filter by title..." 
                        value={searchTitle}
                        onChange={e => setSearchTitle(e.target.value)}
                        className="w-full sm:w-auto flex-grow p-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                    <input 
                        type="text" 
                        placeholder="Filter by location..." 
                        value={searchLocation}
                        onChange={e => setSearchLocation(e.target.value)}
                        className="w-full sm:w-auto flex-grow p-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                    />
                    <button onClick={handleSearch} className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors">
                        Search
                    </button>
                    <button onClick={handleClearSearch} className="w-full sm:w-auto bg-gray-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-gray-600 transition-colors">
                        Clear
                    </button>
                </div>
            )}


            {view === 'list' ? (
                <div className="space-y-6">
                    {isTranslating && (
                        <div className="text-center text-white p-4 bg-black/30 rounded-lg">Translating listings...</div>
                    )}
                    {jobsToDisplay.length > 0 ? jobsToDisplay.map(job => {
                        const displayJob = getJobDisplayData(job);
                        return (
                         <div key={job.id} className="bg-white/90 backdrop-blur-sm border-l-4 border-green-500 p-6 rounded-lg shadow-md transition-shadow hover:shadow-xl">
                            <h3 className="text-2xl font-bold text-green-800">{displayJob.title}</h3>
                            <div className="flex items-center text-gray-600 font-medium my-2">
                                <LocationMarkerIcon className="w-5 h-5 mr-2 text-gray-500"/>
                                <span>{displayJob.location}</span>
                            </div>
                            <p className="text-gray-700 mt-3 text-base">{displayJob.description}</p>
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <button onClick={() => setSelectedJob(job)} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-2 px-5 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all text-sm shadow-md">
                                    Contact / Apply
                                </button>
                            </div>
                        </div>
                    )}) : (
                        <div className="text-center text-gray-200 p-8 border-2 border-dashed border-gray-400 rounded-lg bg-black/20">
                            <BriefcaseIcon className="w-12 h-12 mx-auto mb-3 text-gray-300"/>
                            <p className="text-xl">
                                {appliedFilters.title || appliedFilters.location ? 'No jobs match your current filters.' : 'No job listings available right now. Be the first to post!'}
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Post a New Job</h3>
                    <form onSubmit={handleSubmit} className="space-y-5">
                         <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language of Post</label>
                            <p className="text-xs text-gray-600 mb-2">Select the language you are writing the job details in. This helps us translate it accurately for others.</p>
                            <select 
                                value={originalLanguage} 
                                onChange={e => setOriginalLanguage(e.target.value)}
                                className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                            >
                                {allLanguages.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                            </select>
                         </div>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Job Title (e.g., Tractor Operator)" className="w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                        <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Location (e.g., Nashik, Maharashtra)" className="w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Job Description" rows={4} className="w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
                        <input type="text" value={contact} onChange={e => setContact(e.target.value)} placeholder="Contact Email or Phone" className="w-full p-3 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"/>
                        {error && <p className="text-red-500">{error}</p>}
                        <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-lg shadow-md">Submit Job Posting</button>
                    </form>
                </div>
            )}
        </div>

      </div>
    </section>
    </>
    );
}

export default JobBoard;