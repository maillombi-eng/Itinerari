import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Itinerary, TransportMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const activitySchemaProperties = {
  time: { type: Type.STRING, description: "Orario suggerito, es. 'Pomeriggio' o '15:00'" },
  title: { type: Type.STRING, description: "Nome del luogo o attività in ITALIANO" },
  description: { type: Type.STRING, description: "Breve descrizione in ITALIANO" },
  type: { 
    type: Type.STRING, 
    enum: ["VISIT", "FOOD", "TRANSIT"],
    description: "Tipo di attività"
  },
  subtype: { 
    type: Type.STRING, 
    description: "Categoria breve es. 'Museo', 'Parco', 'Bar Panoramico', 'Transfer'." 
  },
  locationName: { type: Type.STRING, description: "Indirizzo preciso o nome del luogo per Google Maps" },
  coordinates: {
    type: Type.OBJECT,
    properties: {
      lat: { type: Type.NUMBER },
      lng: { type: Type.NUMBER }
    },
    required: ["lat", "lng"]
  },
  estimatedDuration: { type: Type.STRING, description: "Tempo di permanenza nel luogo (es. '1.5 ore')" },
  distanceFromPrevious: { type: Type.STRING, description: "Distanza in km/metri dalla tappa precedente (es. '800m', '3km')" },
  travelTime: { type: Type.STRING, description: "Tempo di viaggio stimato dalla tappa precedente (es. '10 min a piedi', '20 min metro')" },
  transportCost: { type: Type.STRING, description: "Costo stimato spostamento dalla tappa precedente se ci sono mezzi (es. '€1.50', 'Taxi ~€15', 'Gratis')" },
  rating: { type: Type.STRING, description: "Valutazione media" },
  reviews: { type: Type.STRING, description: "Numero recensioni" },
  price: { type: Type.STRING, description: "Costo ingresso/consumazione attività (es. '€15', 'Gratis', '€25-40 a persona')" }
};

const itinerarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    destination: { type: Type.STRING, description: "Nome della città o destinazione" },
    totalDays: { type: Type.INTEGER, description: "Numero totale di giorni" },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dayNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING, description: "Un breve tema evocativo per la giornata in ITALIANO" },
          dailyContext: { type: Type.STRING, description: "Breve contesto storico o culturale" },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: activitySchemaProperties,
              required: ["time", "title", "description", "type", "locationName", "coordinates", "estimatedDuration", "rating", "reviews", "price"]
            }
          },
          optionalActivities: {
            type: Type.ARRAY,
            description: "2 attività EXTRA facoltative suggerite per questa giornata (es. un museo alternativo, un locale notturno, shopping)",
            items: {
              type: Type.OBJECT,
              properties: activitySchemaProperties,
              required: ["title", "description", "type", "locationName", "coordinates", "estimatedDuration", "price"]
            }
          }
        },
        required: ["dayNumber", "theme", "dailyContext", "activities"]
      }
    }
  },
  required: ["destination", "totalDays", "days"]
};

export const generateItinerary = async (
  city: string, 
  days: number,
  startDate: string,
  arrivalTime: string, 
  departureTime: string,
  hotelAddress: string,
  transportMode: TransportMode
): Promise<Itinerary> => {
  try {
    const transportLabel = 
      transportMode === 'walking' ? "A PIEDI (considera distanze brevi)" :
      transportMode === 'public_transport' ? "MEZZI PUBBLICI (Bus/Metro/Tram)" :
      "AUTO/TAXI (Traffico stradale)";

    const prompt = `
      Agisci come una guida turistica esperta locale.
      Crea un itinerario dettagliato di ${days} giorni per visitare ${city}.
      
      DETTAGLI LOGISTICI:
      - Punto di partenza (Alloggio): ${hotelAddress}.
      - Data di inizio viaggio: ${startDate}. 
      - L'itinerario del primo giorno deve iniziare alle ore: ${arrivalTime}.
      - L'itinerario dell'ultimo giorno deve concludersi entro le ore: ${departureTime}.
      
      MODALITÀ DI TRASPORTO: 
      - L'utente si sposterà principalmente: ${transportLabel}.
      
      CONTENUTO:
      - TEMA (theme) specifico per ogni giornata.
      - 'dailyContext' (max 30-40 parole): curiosità o cenni storici.
      - Attività principali sequenziali.
      
      COSTI E PREZZI:
      - Per ogni attività (Sia principale che opzionale), DEVI fornire una stima realistica del prezzo nel campo 'price'.
      - Se è un ristorante o bar, scrivi un range di prezzo indicativo (es: "€20-35 a persona", "€10-15").
      - Se è un'attrazione, scrivi il costo del biglietto intero (es: "€18", "Gratis").
      
      ISTRUZIONI SPECIALI GIORNO 1:
      - La PRIMISSIMA attività del Giorno 1 (all'orario ${arrivalTime}) DEVE essere: "Arrivo e Trasferimento in Hotel".
      - Descrivi le migliori opzioni per raggiungere l'alloggio (${hotelAddress}) dall'aeroporto principale o stazione centrale di ${city}.
      - Indica chiaramente costi e tempi per Taxi, Bus o Treno nella descrizione.
      - Imposta 'type' a 'TRANSIT' e 'subtype' a 'Transfer/Arrivo'.
      
      REGOLE GENERALI ATTIVITÀ:
      - IMPORTANTE: Per ogni attività successiva (esclusa la prima), calcola realisticamente 'distanceFromPrevious', 'travelTime' e 'transportCost' basandoti sulla modalità di trasporto scelta (${transportMode}).
      - **NUOVO: 'optionalActivities'**: Per ogni giornata, suggerisci 1 o 2 attività EXTRA facoltative. 
      
      LINGUA:
      - TUTTO il contenuto DEVE essere rigorosamente in LINGUA ITALIANA.
      
      FORMATO:
      - Rispondi ESCLUSIVAMENTE con un oggetto JSON valido conforme allo schema fornito.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.4,
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("Nessun testo restituito da Gemini");
    }

    const data = JSON.parse(jsonText) as Itinerary;
    data.startDate = startDate;
    
    return data;
  } catch (error) {
    console.error("Errore durante la generazione dell'itinerario:", error);
    throw error;
  }
};