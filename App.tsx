import React, { useState } from 'react';
import InputForm from './components/InputForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import { generateItinerary } from './services/geminiService';
import { FormState, Itinerary } from './types';
import { Map, AlertTriangle } from 'lucide-react';

const Logo = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
    <path d="M4 12C4 12 7 11 9 14C11 17 14 17 14 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    <path d="M12 2C12 2 13 5 11 8C9 11 9 14 9 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    <path d="M21.16 14.84L14.84 21.16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    <path d="M2.84 9.16L9.16 2.84" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
    <path d="M11 12.5L7 16V17.5L11 16L15 17.5V16L11 12.5ZM11 12.5L11.5 6.5L13 6L11.5 5.5L11 2L10.5 5.5L9 6L10.5 6.5L11 12.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"/>
  </svg>
);

const App: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: FormState) => {
    setLoading(true);
    setError(null);
    try {
      // Pass all form fields to the service including transportMode and startDate
      const result = await generateItinerary(
        data.city, 
        data.days,
        data.startDate,
        data.arrivalTime, 
        data.departureTime, 
        data.hotelAddress,
        data.transportMode
      );
      setItinerary(result);
    } catch (err: any) {
      console.error("Error generating itinerary:", err);
      
      let errorMessage = "Si è verificato un errore imprevisto durante la generazione. Per favore riprova.";

      // Gestione specifica degli errori comuni
      if (err.message) {
        if (err.message.includes('API_KEY') || err.message.includes('403')) {
           errorMessage = "Errore di configurazione: API Key mancante o non valida.";
        } else if (err.message.includes('503')) {
           errorMessage = "I server AI sono momentaneamente sovraccarichi. Attendi qualche istante e riprova.";
        } else if (err.message.includes('429')) {
           errorMessage = "Troppe richieste inviate in breve tempo. Attendi un minuto e riprova.";
        } else if (err.message.includes('SAFETY') || err.message.includes('candidate')) {
           errorMessage = "La richiesta è stata bloccata dai filtri di sicurezza. Prova a riformulare la richiesta.";
        } else if (err.message.includes('JSON') || err.message.includes('Unexpected token')) {
           errorMessage = "Errore nell'elaborazione dei dati ricevuti dall'AI. Riprova, di solito si risolve al secondo tentativo.";
        } else if (err.message.includes('Nessun testo')) {
           errorMessage = "L'AI non ha restituito alcun contenuto. Riprova.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header / Nav */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
              <div className="bg-primary p-1.5 rounded-xl text-white shadow-inner transform group-hover:scale-110 transition-transform">
                <Logo />
              </div>
              <span className="text-xl font-black text-slate-800 tracking-tight">
                Itinera<span className="text-primary">PDF</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
            <AlertTriangle className="shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold">Ops! Qualcosa è andato storto.</p>
              <p className="text-sm mt-1 opacity-90">{error}</p>
            </div>
          </div>
        )}

        {!itinerary ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="mb-8 text-center max-w-2xl px-4">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Il tuo viaggio perfetto, <br/>
                <span className="text-primary">disegnato dall'AI.</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed">
                Inserisci la tua destinazione e noi creeremo un itinerario completo con mappe, tempi e distanze, pronto da scaricare in PDF per la tua prossima avventura.
              </p>
            </div>
            <InputForm onSubmit={handleFormSubmit} isLoading={loading} />
          </div>
        ) : (
          <ItineraryDisplay itinerary={itinerary} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-4 opacity-50 grayscale">
            <Logo />
          </div>
          <p className="text-sm font-medium tracking-wide">© {new Date().getFullYear()} ItineraPDF. Powered by Google Gemini.</p>
          <p className="text-[10px] mt-2 opacity-30">Pianificazione intelligente per viaggiatori curiosi.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;