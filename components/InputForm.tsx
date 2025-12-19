import React, { useState } from 'react';
import { FormState, TransportMode } from '../types';
import { MapPin, Calendar, Loader2, Plane, Clock, Building, LogOut, Footprints, Bus, Car } from 'lucide-react';

interface Props {
  onSubmit: (data: FormState) => void;
  isLoading: boolean;
}

const InputForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [city, setCity] = useState('');
  const [days, setDays] = useState(3);
  // Default start date to tomorrow
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [arrivalTime, setArrivalTime] = useState('10:00');
  const [departureTime, setDepartureTime] = useState('18:00');
  const [hotelAddress, setHotelAddress] = useState('');
  const [transportMode, setTransportMode] = useState<TransportMode>('walking');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validazione rigorosa
    if (city.trim() && days > 0 && hotelAddress.trim() && arrivalTime && departureTime && startDate) {
      onSubmit({ city, days, startDate, arrivalTime, departureTime, hotelAddress, transportMode });
    }
  };

  const getTransportIcon = () => {
    switch (transportMode) {
      case 'walking': return <Footprints className="absolute left-3 top-3 text-slate-400" size={18} />;
      case 'public_transport': return <Bus className="absolute left-3 top-3 text-slate-400" size={18} />;
      case 'driving': return <Car className="absolute left-3 top-3 text-slate-400" size={18} />;
      default: return <Footprints className="absolute left-3 top-3 text-slate-400" size={18} />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-primary p-6 text-white text-center">
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-white/20 rounded-full">
                <Plane size={32} />
            </div>
        </div>
        <h2 className="text-2xl font-bold">Crea il tuo viaggio</h2>
        <p className="text-teal-100 text-sm mt-1">L'intelligenza artificiale pianificherà tutto per te.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="city" className="block text-sm font-medium text-slate-700">
            Destinazione
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Es. Roma, Tokyo, Parigi"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all text-slate-900"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700">
                Data inizio viaggio
            </label>
            <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all text-slate-900"
                    required
                />
            </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="hotel" className="block text-sm font-medium text-slate-700">
            Indirizzo Hotel/Alloggio (Partenza)
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-3 text-slate-400" size={18} />
            <input
              id="hotel"
              type="text"
              value={hotelAddress}
              onChange={(e) => setHotelAddress(e.target.value)}
              placeholder="Es. Via Roma 1, Centro"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all text-slate-900"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label htmlFor="days" className="block text-sm font-medium text-slate-700">
                Durata (giorni)
                </label>
                <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                    id="days"
                    type="number"
                    min="1"
                    max="14"
                    value={days}
                    onChange={(e) => setDays(parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all text-slate-900"
                    required
                />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="transport" className="block text-sm font-medium text-slate-700">
                Spostamenti
                </label>
                <div className="relative">
                {getTransportIcon()}
                <select
                    id="transport"
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value as TransportMode)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all appearance-none cursor-pointer text-slate-900"
                    required
                >
                    <option value="walking">A piedi</option>
                    <option value="public_transport">Mezzi pubblici</option>
                    <option value="driving">Auto / Taxi</option>
                </select>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="arrivalTime" className="block text-sm font-medium text-slate-700">
              Arrivo (Giorno 1)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                id="arrivalTime"
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all text-slate-900"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="departureTime" className="block text-sm font-medium text-slate-700">
              Partenza (Fine)
            </label>
            <div className="relative">
              <LogOut className="absolute left-3 top-3 text-slate-400" size={18} />
              <input
                id="departureTime"
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white outline-none transition-all text-slate-900"
                required
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generazione in corso...
            </>
          ) : (
            'Genera Itinerario'
          )}
        </button>
      </form>
    </div>
  );
};

export default InputForm;