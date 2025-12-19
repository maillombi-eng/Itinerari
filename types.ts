export enum ActivityType {
  VISIT = 'VISIT',
  FOOD = 'FOOD',
  TRANSIT = 'TRANSIT'
}

export type TransportMode = 'walking' | 'public_transport' | 'driving';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Activity {
  time: string;
  title: string;
  description: string;
  type: ActivityType;
  subtype?: string; // e.g. "Pranzo", "Cena", "Aperitivo", "Museo"
  locationName: string;
  coordinates: Coordinates;
  estimatedDuration: string; // Time spent AT the location
  distanceFromPrevious?: string; // Distance from previous location
  travelTime?: string; // Time to travel from previous location
  transportCost?: string; // Cost of ticket/taxi
  rating?: string; // e.g. "4.7"
  reviews?: string; // e.g. "2000+ recensioni"
  price?: string; // e.g. "€15", "Gratis", "€30-50"
}

export interface DayPlan {
  dayNumber: number;
  theme: string;
  dailyContext?: string; // Brief historical/cultural context for the day
  activities: Activity[];
  optionalActivities?: Activity[]; // New field for optional suggestions
}

export interface Itinerary {
  destination: string;
  startDate?: string; // Date of the trip
  totalDays: number;
  days: DayPlan[];
}

export interface FormState {
  city: string;
  days: number;
  startDate: string;
  arrivalTime: string;
  departureTime: string;
  hotelAddress: string;
  transportMode: TransportMode;
}

export interface PdfOptions {
  primaryColor: string;
  secondaryColor: string;
  font: 'helvetica' | 'times' | 'courier';
  logoBase64: string | null;
}