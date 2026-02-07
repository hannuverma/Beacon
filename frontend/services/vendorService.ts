import { Vendor } from '../types';

const API_BASE = 'http://127.0.0.1:8000/api';

export async function fetchVendors(): Promise<Vendor[]> {
  try {
    const response = await fetch(`${API_BASE}/vendors/`);
    if (!response.ok) throw new Error('Failed to fetch vendors');
    const data = await response.json();
    // Map backend response to frontend Vendor type
    return data.map((vendor: any) => ({
      id: vendor.id,
      ownerId: vendor.id,
      name: vendor.name,
      category: vendor.category || 'Street Food',
      rating: 4.5, // backend doesn't have this yet
      location: { lat: vendor.lat, lng: vendor.lng, address: vendor.address || '' },
      isOpen: vendor.is_open,
      image: `https://picsum.photos/seed/${vendor.id}/600/400`,
      expectedPurchases: vendor.expected_purchases,
      menu: [],
      events: [],
    }));
  } catch (error) {
    console.error('Error fetching vendors:', error);
    return [];
  }
}

export async function toggleVendorStatus(vendorId: string): Promise<Vendor | null> {
  try {
    const response = await fetch(`${API_BASE}/vendors/${vendorId}/toggle/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Failed to toggle vendor');
    const vendor = await response.json();
    return {
      id: vendor.id,
      ownerId: vendor.id,
      name: vendor.name,
      category: vendor.category || 'Street Food',
      rating: 4.5,
      location: { lat: vendor.lat, lng: vendor.lng, address: vendor.address || '' },
      isOpen: vendor.is_open,
      image: `https://picsum.photos/seed/${vendor.id}/600/400`,
      expectedPurchases: vendor.expected_purchases,
      menu: [],
      events: [],
    };
  } catch (error) {
    console.error('Error toggling vendor:', error);
    return null;
  }
}

export async function createVendor(vendorData: {
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
}): Promise<Vendor | null> {
  try {
    const response = await fetch(`${API_BASE}/vendors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vendorData),
    });
    if (!response.ok) throw new Error('Failed to create vendor');
    const vendor = await response.json();
    return {
      id: vendor.id,
      ownerId: vendor.id,
      name: vendor.name,
      category: vendor.category || 'Street Food',
      rating: 4.5,
      location: { lat: vendor.lat, lng: vendor.lng, address: vendor.address || '' },
      isOpen: vendor.is_open,
      image: `https://picsum.photos/seed/${vendor.id}/600/400`,
      expectedPurchases: vendor.expected_purchases,
      menu: [],
      events: [],
    };
  } catch (error) {
    console.error('Error creating vendor:', error);
    return null;
  }
}
