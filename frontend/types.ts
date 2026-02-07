export enum AppView {
  AUTH = 'AUTH',
  USER = 'USER',
  HOST = 'HOST'
}

export type UserRole = 'USER' | 'HOST';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  host_profile_id?: number;
  homeLocation?: Location;
}

export interface Events {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  event_date: string;
  booking_link: string;
  image: string;
  category: number;
  isActive?: boolean;
}
