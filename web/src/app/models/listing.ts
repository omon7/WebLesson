export interface Listing {
  id: number;
  title: string;
  price: number;
  rooms: number;
  districtId: number;
  districtName: string;
  createdAt: string;
  address?: string;
}

export interface ListingFilter {
  districtId: number | null;
  maxPrice: number | null;
  sort: 'price-asc' | 'price-desc' | 'newest';
  favoritesOnly: boolean;
}