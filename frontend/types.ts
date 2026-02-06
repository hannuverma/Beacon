
export enum AppView {
  AUTH = 'AUTH',
  USER = 'USER',
  VENDOR = 'VENDOR'
}

export type UserRole = 'USER' | 'VENDOR';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  homeLocation?: Location;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  type: 'sale' | 'challenge' | 'live-music' | 'other';
}

export interface Vendor {
  id: string;
  ownerId: string;
  name: string;
  category: 'Street Food' | 'Cafe' | 'Convenience' | 'Bar' | 'Late Night Retail';
  rating: number;
  location: Location;
  isOpen: boolean;
  image: string;
  menu: MenuItem[];
  events: Event[];
  expectedPurchases: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}
