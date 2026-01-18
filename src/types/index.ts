export interface Listing {
  id: number;
  title: string;
  price: number;
  location: string;
  seller: string;
  category: string;
  image: string;
  rating: number;
  isFeatured: boolean;
  isNew: boolean;
  isVerified: boolean;
  seasonal: boolean;
  unit: string;
  unitOptions: string[];
  description: string;
  seasonTag: string | null;
  distance: number;
  lastSeen: string;
  phone?: string;
  views?: number;
  saves?: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Notification {
  id: number;
  message: string;
  time: string;
  type: 'order' | 'message' | 'alert';
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  location: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  badges: string[];
  joinedDate: string;
}

export interface Message {
  id: number;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  read: boolean;
  listingId?: number;
}

export interface Offer {
  id: number;
  listingId: number;
  buyerId: string;
  sellerId: string;
  offerPrice: number;
  originalPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  message?: string;
  timestamp: string;
}