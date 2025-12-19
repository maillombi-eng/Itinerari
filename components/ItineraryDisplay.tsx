import React, { useState } from 'react';
import { Itinerary, ActivityType, PdfOptions, Activity as ActivityItem } from '../types';
import { 
  Utensils, UtensilsCrossed, MapPin, Navigation, Clock, Download, ExternalLink, 
  Star, Coffee, Wine, Euro, Info, Settings, Image as ImageIcon, X,
  Landmark, Trees, Church, ShoppingBag, IceCream, Pizza, Beer, Sparkles,
  Bus, Car, Footprints, Coins, Phone, Filter, Camera, Music, Tent, Mountain, Snowflake,
  Ticket, Moon, Waves, Sun, Palette, Castle, Drama, BookOpen, Bike, Plane, Train,
  Flower, Anchor, Fish, Martini, Scroll, Clapperboard, Microscope, History, Heart, Grape,
  Timer
} from 'lucide-react';
import { createPDF } from '../services/pdfService';

interface Props {
  itinerary: Itinerary;
  onReset: () => void;
}

type FilterType = 'ALL' | 'VISIT' | 'FOOD';

const ItineraryDisplay: React.FC<Props> = ({ itinerary, onReset }) => {
  const [showPdfSettings, setShowPdfSettings] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [pdfOptions, setPdfOptions] = useState<PdfOptions>({
    primaryColor: '#0f766e', // Default Teal
    secondaryColor: '#f59e0b', // Default Amber
    font: 'helvetica',
    logoBase64: null
  });

  const handleDownload = () => {
    createPDF(itinerary, pdfOptions);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfOptions(prev => ({ ...prev, logoBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setPdfOptions(prev => ({ ...prev, logoBase64: null }));
  };

  const openMap = (placeName: string, locationName: string, coords: {lat: number, lng: number}) => {
    const queryStr = `${placeName}, ${locationName || ''}, ${itinerary.destination}`;
    const encodedQuery = encodeURIComponent(uniqueClean(queryStr));
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}&query_place_id=${placeName}`;
    window.open(url, '_blank');
  };

  const uniqueClean = (str: string) => {
    return str.split(',').map(s => s.trim()).filter((v, i, a) => v && a.indexOf(v) === i).join(', ');
  };

  const handleContact = (name: string) => {
    const query = encodeURIComponent(`${name} ${itinerary.destination} contatti telefono prenotazione`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const isSkiActivity = (subtype?: string) => {
    const s = subtype?.toLowerCase() || '';
    return s.includes('sci') || s.includes('neve') || s.includes('impiant') || s.includes('pista') || s.includes('invernal') || s.includes('snowboard');
  };

  const handleSkiInfo = (name: string) => {
    const query = encodeURIComponent(`${name} ${itinerary.destination} bollettino neve impianti aperti prezzi skipass`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const getSubtypeIcon = (subtype: string, size: number = 14, className?: string) => {
    const s = subtype?.toLowerCase() || '';
    const props = { size, className };
    
    if (s.includes('biglietto') || s.includes('ticket') || s.includes('costo') || s.includes('prenotazione')) return <Ticket {...props} />;
    if (s.includes('aereo') || s.includes('aeroporto') || s.includes('volo') || s.includes('transfer') || s.includes('arrivo')) return <Plane {...props} />;
    if (s.includes('treno') || s.includes('stazione') || s.includes('binario')) return <Train {...props} />;
    if (s.includes('taxi') || s.includes('uber') || s.includes('ncc') || s.includes('noleggio')) return <Car {...props} />;
    if (s.includes('bus') || s.includes('autobus') || s.includes('pullman') || s.includes('navetta')) return <Bus {...props} />;
    if (s.includes('sci') || s.includes('snowboard') || s.includes('pista') || s.includes('impiant')) return <Snowflake {...props} />;
    if (s.includes('ciaspol') || s.includes('neve')) return <Footprints {...props} />;
    if (s.includes('bici') || s.includes('bike') || s.includes('ciclismo')) return <Bike {...props} />;
    if (s.includes('trekking') || s.includes('escursion') || s.includes('sentiero')) return <Footprints {...props} />;
    if (s.includes('montagna') || s.includes('scalata')) return <Mountain {...props} />;
    if (s.includes('barca') || s.includes('crociera') || s.includes('traghetto')) return <Anchor {...props} />;
    if (s.includes('acquario') || s.includes('pesc') || s.includes('diving')) return <Fish {...props} />;
    if (s.includes('spiaggia') || s.includes('mare') || s.includes('lago')) return <Waves {...props} />;
    if (s.includes('parco') || s.includes('natur') || s.includes('bosco')) return <Trees {...props} />;
    if (s.includes('teatro') || s.includes('opera') || s.includes('balletto')) return <Drama {...props} />;
    if (s.includes('club') || s.includes('discoteca') || s.includes('night')) return <Moon {...props} />;
    if (s.includes('cinema') || s.includes('film')) return <Clapperboard {...props} />;
    if (s.includes('spa') || s.includes('terme') || s.includes('relax')) return <Sparkles {...props} />;
    if (s.includes('gelat') || s.includes('pasticc') || s.includes('dolc')) return <IceCream {...props} />;
    if (s.includes('pizz')) return <Pizza {...props} />;
    if (s.includes('birr') || s.includes('pub')) return <Beer {...props} />;
    if (s.includes('colaz') || s.includes('caff') || s.includes('brunch')) return <Coffee {...props} />;
    if (s.includes('cocktail') || s.includes('drink')) return <Martini {...props} />;
    if (s.includes('aperit') || s.includes('wine') || s.includes('bar') || s.includes('cantina')) return <Wine {...props} />;
    if (s.includes('cena')) return <UtensilsCrossed {...props} />;
    if (s.includes('pranzo') || s.includes('ristorante') || s.includes('trattoria')) return <Utensils {...props} />;
    if (s.includes('storia') || s.includes('archeolog') || s.includes('rovine')) return <History {...props} />;
    if (s.includes('museo') || s.includes('galleria') || s.includes('arte')) return <Palette {...props} />;
    if (s.includes('chiesa') || s.includes('duomo') || s.includes('basilica')) return <Church {...props} />;
    if (s.includes('mercat') || s.includes('shop') || s.includes('negoz')) return <ShoppingBag {...props} />;
    
    return <MapPin {...props} />;
  };

  const getSubtypeColor = (subtype: string) => {
    const s = subtype?.toLowerCase() || '';
    if (s.includes('transfer') || s.includes('arrivo') || s.includes('taxi')) return 'bg-slate-100 text-slate-700 border-slate-200';
    if (s.includes('neve') || s.includes('sci')) return 'bg-blue-50 text-blue-800 border-blue-200';
    if (s.includes('parco') || s.includes('natur') || s.includes('trekking')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s.includes('spiaggia') || s.includes('mare') || s.includes('barca')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    if (s.includes('spa') || s.includes('benessere')) return 'bg-teal-100 text-teal-800 border-teal-200';
    if (s.includes('museo') || s.includes('arte') || s.includes('teatro')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (s.includes('storia') || s.includes('rovine')) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (s.includes('palazzo') || s.includes('piazza') || s.includes('monumento')) return 'bg-orange-100 text-orange-900 border-orange-200';
    if (s.includes('chiesa') || s.includes('duomo')) return 'bg-sky-100 text-sky-800 border-sky-200';
    if (s.includes('mercat') || s.includes('shop')) return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
    if (s.includes('colaz') || s.includes('caff') || s.includes('dolc')) return 'bg-rose-100 text-rose-800 border-rose-200';
    if (s.includes('aperit') || s.includes('bar') || s.includes('club') || s.includes('wine')) return 'bg-violet-100 text-violet-800 border-violet-200';
    if (s.includes('pranzo') || s.includes('cena') || s.includes('ristorante')) return 'bg-red-50 text-red-800 border-red-200';
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const getTravelIcon = (travelTime: string, className: string = "text-slate-500") => {
      const t = travelTime.toLowerCase();
      const props = { size: 14, className };
      if (t.includes('taxi') || t.includes('auto') || t.includes('uber')) return <Car {...props} />;
      if (t.includes('metro') || t.includes('bus') || t.includes('tram') || t.includes('treno')) return <Bus {...props} />;
      return <Footprints {...props} />;
  };

  const filteredDays = itinerary.days.map(day => {
    const filteredActivities = day.activities.filter(act => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'VISIT') return act.type === ActivityType.VISIT;
      if (activeFilter === 'FOOD') return act.type === ActivityType.FOOD;
      return true;
    });
    
    const filteredOptional = day.optionalActivities?.filter(act => {
      if (activeFilter === 'ALL') return true;
      if (activeFilter === 'VISIT') return act.type === ActivityType.VISIT;
      if (activeFilter === 'FOOD') return act.type === ActivityType.FOOD;
      return true;
    });

    return { ...day, activities: filteredActivities, optionalActivities: filteredOptional };
  }).filter(day => day.activities.length > 0);

  const getMealSummary = (activities: ActivityItem[]) => {
    const foodActivities = activities.filter(a => a.type === ActivityType.FOOD);
    const meals = {
      breakfast: foodActivities.find(a => a.subtype?.toLowerCase().includes('colazione') || a.subtype?.toLowerCase().includes('brunch')),
      lunch: foodActivities.find(a => a.subtype?.toLowerCase().includes('pranzo') || a.subtype?.toLowerCase().includes('osteria') || a.subtype?.toLowerCase().includes('trattoria')),
      dinner: foodActivities.find(a => a.subtype?.toLowerCase().includes('cena') || a.subtype?.toLowerCase().includes('ristorante'))
    };
    return meals;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Card */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-800 break-words">Itinerario: {itinerary.destination}</h1>
            <p className="text-slate-500 mt-1">{itinerary.totalDays} Giorni di esplorazione</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={onReset} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Nuova ricerca</button>
            <button 
              onClick={() => setShowPdfSettings(!showPdfSettings)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${showPdfSettings ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Settings size={18} />
              <span>Opzioni PDF</span>
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 bg-accent hover:bg-amber-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-md transition-all active:scale-95">
              <Download size={18} />
              Scarica PDF
            </button>
          </div>
        </div>

        {showPdfSettings && (
          <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
               <Settings size={16} className="text-slate-500" />
               <h3 className="font-semibold text-slate-700">Personalizza il documento</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Colore Principale</label>
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-300 shadow-sm">
                    <input 
                      type="color" value={pdfOptions.primaryColor}
                      onChange={(e) => setPdfOptions(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="h-8 w-12 p-0 border-0 rounded cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-900 font-bold uppercase flex-1">{pdfOptions.primaryColor}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Colore Accento</label>
                  <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-300 shadow-sm">
                    <input 
                      type="color" value={pdfOptions.secondaryColor}
                      onChange={(e) => setPdfOptions(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="h-8 w-12 p-0 border-0 rounded cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-900 font-bold uppercase flex-1">{pdfOptions.secondaryColor}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Font</label>
                <div className="relative">
                  <select 
                    value={pdfOptions.font}
                    onChange={(e) => setPdfOptions(prev => ({ ...prev, font: e.target.value as any }))}
                    className="w-full h-[42px] px-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-900 font-medium focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer shadow-sm appearance-none"
                  >
                    <option value="helvetica" className="text-slate-900 bg-white">Helvetica (Moderno)</option>
                    <option value="times" className="text-slate-900 bg-white">Times New Roman (Classico)</option>
                    <option value="courier" className="text-slate-900 bg-white">Courier (Macchina da scrivere)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">Logo</label>
                {!pdfOptions.logoBase64 ? (
                  <label className="flex items-center justify-center gap-2 w-full h-[106px] px-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-white hover:border-primary cursor-pointer text-sm text-slate-600 transition-all">
                    <div className="text-center"><ImageIcon size={24} className="mx-auto mb-1 text-slate-400" /><span>Carica immagine</span></div>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                ) : (
                  <div className="flex flex-col gap-2 h-[106px] px-3 py-3 bg-white border border-slate-300 rounded-lg shadow-sm">
                    <div className="flex-1 rounded overflow-hidden bg-slate-100 border border-slate-100 relative group">
                      <img src={pdfOptions.logoBase64} alt="Logo" className="w-full h-full object-contain" />
                      <button onClick={removeLogo} className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-600 bg-white/90 p-1.5 rounded-full"><X size={16} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        <button onClick={() => setActiveFilter('ALL')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === 'ALL' ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-100' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><Filter size={16} /> Tutte le attività</button>
        <button onClick={() => setActiveFilter('VISIT')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === 'VISIT' ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-100' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><Camera size={16} /> Visite & Cultura</button>
        <button onClick={() => setActiveFilter('FOOD')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeFilter === 'FOOD' ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-100' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}><Utensils size={16} /> Cibo & Relax</button>
      </div>

      {/* Days List */}
      <div className="space-y-8">
        {filteredDays.map((day) => {
          const meals = getMealSummary(day.activities);
          return (
            <div key={day.dayNumber} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-secondary p-4 border-b border-teal-100">
                <h2 className="text-xl font-bold text-teal-900 flex items-center gap-2">
                  <span className="bg-white w-8 h-8 rounded-full flex items-center justify-center text-sm border border-teal-200 shadow-sm">{day.dayNumber}</span>
                  {day.theme}
                </h2>
                {day.dailyContext && (
                  <div className="mt-3 flex gap-2 text-teal-800 text-sm bg-teal-50/50 p-2.5 rounded-lg border border-teal-100/50">
                      <Info size={16} className="text-teal-600 shrink-0 mt-0.5" />
                      <p className="italic leading-relaxed opacity-90 break-words">{day.dailyContext}</p>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                {/* Piano Pasti Section */}
                {(meals.breakfast || meals.lunch || meals.dinner) && (
                  <div className="mb-8 p-4 bg-orange-50/50 border border-orange-100 rounded-xl">
                    <div className="flex items-center gap-2 mb-3 text-orange-800 font-bold text-sm uppercase tracking-wider">
                      <Utensils size={16} />
                      Piano Pasti della Giornata
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {meals.breakfast && (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-orange-100 shadow-sm">
                          <div className="p-2 bg-rose-100 text-rose-600 rounded-md"><Coffee size={18} /></div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Colazione</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{meals.breakfast.title}</p>
                            {meals.breakfast.price && <p className="text-[10px] font-medium text-rose-600">{meals.breakfast.price}</p>}
                          </div>
                        </div>
                      )}
                      {meals.lunch && (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-orange-100 shadow-sm">
                          <div className="p-2 bg-orange-100 text-orange-600 rounded-md"><Utensils size={18} /></div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Pranzo</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{meals.lunch.title}</p>
                            {meals.lunch.price && <p className="text-[10px] font-medium text-orange-600">{meals.lunch.price}</p>}
                          </div>
                        </div>
                      )}
                      {meals.dinner && (
                        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-orange-100 shadow-sm">
                          <div className="p-2 bg-violet-100 text-violet-600 rounded-md"><UtensilsCrossed size={18} /></div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Cena</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{meals.dinner.title}</p>
                            {meals.dinner.price && <p className="text-[10px] font-medium text-violet-600">{meals.dinner.price}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="relative border-l-2 border-slate-200 ml-4 space-y-12 pb-2">
                  {day.activities.map((activity, idx) => (
                    <div key={idx} className="relative pl-8 group">
                      <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10 ${activity.type === ActivityType.FOOD ? 'bg-orange-400 ring-4 ring-orange-50' : 'bg-teal-600 ring-4 ring-teal-50'}`}></div>
                      
                      <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                              <span className="text-sm font-mono font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">{activity.time}</span>
                              {activity.subtype && (
                                  <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm transition-transform active:scale-95 ${getSubtypeColor(activity.subtype)}`}>
                                      {getSubtypeIcon(activity.subtype, 14)}
                                      {activity.subtype.toUpperCase()}
                                  </span>
                              )}
                          </div>
                          
                          <div className="flex flex-wrap items-baseline gap-2 mb-2">
                              <h3 className="text-xl font-bold text-slate-900 break-words">{activity.title}</h3>
                              {activity.rating && (
                                <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                  <Star size={12} fill="currentColor" /><span>{activity.rating}</span><span className="text-slate-400 font-normal ml-0.5 whitespace-nowrap">({activity.reviews})</span>
                                </div>
                              )}
                          </div>
                          
                          <p className="text-slate-600 mb-3 leading-relaxed break-words whitespace-normal">{activity.description}</p>

                          {/* Refined Logistics Metadata Section */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[13px] mb-5">
                               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200" title="Durata prevista">
                                  <Clock size={13} className="text-slate-500" />
                                  <span className="font-medium whitespace-nowrap">{activity.estimatedDuration}</span>
                               </div>

                               {activity.price && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100" title="Costo attività/pasto">
                                      <Euro size={13} className="text-rose-600" />
                                      <span className="font-medium whitespace-nowrap">{activity.price}</span>
                                  </div>
                               )}
                               
                               {idx > 0 && activity.travelTime && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-100" title="Tempo di percorrenza">
                                      <Timer size={13} className="text-amber-600" />
                                      <span className="font-medium whitespace-nowrap">{activity.travelTime}</span>
                                  </div>
                               )}

                               {idx > 0 && activity.transportCost && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-100" title="Costo del trasporto">
                                      <Coins size={13} className="text-emerald-600" />
                                      <span className="font-medium whitespace-nowrap">{activity.transportCost}</span>
                                  </div>
                               )}

                               {idx > 0 && activity.distanceFromPrevious && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100" title="Distanza">
                                      <Navigation size={13} className="text-blue-600" />
                                      <span className="font-medium whitespace-nowrap">{activity.distanceFromPrevious}</span>
                                  </div>
                               )}
                          </div>

                          <div className="flex flex-wrap gap-3 mt-4">
                              <button 
                                  onClick={() => openMap(activity.title, activity.locationName, activity.coordinates)}
                                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 group/btn"
                              >
                                  <MapPin size={18} className="group-hover/btn:animate-bounce" />
                                  Apri Mappa
                                  <ExternalLink size={14} className="opacity-70 group-hover/btn:opacity-100" />
                              </button>
                              {isSkiActivity(activity.subtype) && (
                                  <button onClick={() => handleSkiInfo(activity.title)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"><Snowflake size={18} />Info Neve</button>
                              )}
                              {(activity.type === ActivityType.FOOD || activity.subtype?.toLowerCase().includes('hotel')) && (
                                  <button onClick={() => handleContact(activity.title)} className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold py-2.5 px-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"><Phone size={18} className="text-slate-500" />Contatta</button>
                              )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {day.optionalActivities && day.optionalActivities.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-dashed border-slate-300">
                     <h3 className="flex items-center gap-2 text-lg font-bold text-slate-700 mb-4"><Sparkles size={18} className="text-amber-500" />Alternative Serali & Extra</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {day.optionalActivities.map((opt, oIdx) => (
                          <div key={oIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-teal-300 transition-colors">
                             <div className="flex justify-between items-start mb-2">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shadow-sm transition-transform active:scale-95 ${getSubtypeColor(opt.subtype || '')}`}>{opt.subtype || 'Extra'}</span>
                                {opt.price && <span className="text-[10px] font-bold text-slate-500">{opt.price}</span>}
                             </div>
                             <h4 className="font-bold text-slate-800 mb-1 mt-2 flex items-center gap-2"><span className="text-teal-600 shrink-0">{getSubtypeIcon(opt.subtype || '', 16)}</span><span className="break-words">{opt.title}</span></h4>
                             <p className="text-sm text-slate-600 mb-3 line-clamp-2 break-words">{opt.description}</p>
                             <div className="flex flex-wrap items-center justify-between mt-auto gap-2">
                                <button onClick={() => openMap(opt.title, opt.locationName, opt.coordinates)} className="text-blue-600 hover:text-blue-800 text-xs font-semibold flex items-center gap-1 group/opt-btn">Mappa <ExternalLink size={10} /></button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ItineraryDisplay;