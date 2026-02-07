
import { host } from './types';

export const INITIAL_hostS: host[] = [
  {
    id: 'v1',
    // Added missing ownerId required by host type
    ownerId: 'owner-1',
    name: 'Midnight Ramen House',
    // Fix: 'Japanese Cuisine' is not assignable to the defined category union type
    category: 'Street Food',
    rating: 4.8,
    // Fix: address is required inside the location object per Location interface
    location: { lat: 40.7128, lng: -74.0060, address: '123 Neon Alley' },
    isOpen: true,
    image: 'https://picsum.photos/seed/ramen/600/400',
    expectedPurchases: 12,
    menu: [
      { id: 'm1', name: 'Tonkotsu Ramen', price: 14.50, description: 'Rich pork broth with chashu pork', category: 'Main' },
      { id: 'm2', name: 'Spicy Miso Ramen', price: 15.00, description: 'Fiery broth with sweet corn', category: 'Main' }
    ],
    events: [
      { id: 'e1', title: 'Late Night Slurp Challenge', description: 'Eat 3 bowls in 10 mins!', startTime: '11:30 PM', type: 'challenge' }
    ]
  },
  {
    id: 'v2',
    // Added missing ownerId required by host type
    ownerId: 'owner-2',
    name: 'Glow Tacos',
    category: 'Street Food',
    rating: 4.5,
    // Fix: address is required inside the location object per Location interface
    location: { lat: 40.7158, lng: -74.0090, address: '45 Moonlit Dr' },
    isOpen: true,
    image: 'https://picsum.photos/seed/tacos/600/400',
    expectedPurchases: 45,
    menu: [
      { id: 'm3', name: 'Al Pastor', price: 3.50, description: 'Classic pineapple marinated pork', category: 'Taco' },
      { id: 'm4', name: 'Carne Asada', price: 4.00, description: 'Grilled steak perfection', category: 'Taco' }
    ],
    events: []
  },
  {
    id: 'v3',
    // Added missing ownerId required by host type
    ownerId: 'owner-3',
    name: 'Lunar Coffee Bar',
    // Fix: 'Café' (with accent) is not assignable to 'Cafe' literal type
    category: 'Cafe',
    rating: 4.9,
    // Fix: address is required inside the location object per Location interface
    location: { lat: 40.7090, lng: -74.0120, address: '88 Starlight Way' },
    isOpen: false,
    image: 'https://picsum.photos/seed/coffee/600/400',
    expectedPurchases: 2,
    menu: [
      { id: 'm5', name: 'Moonlight Latte', price: 5.50, description: 'Lavender infused charcoal latte', category: 'Coffee' }
    ],
    events: []
  }
];
