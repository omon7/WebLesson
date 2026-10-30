export interface Listing {
  id: number;
  title: string;
  price: number;
  rooms: number;
  districtId: number;
  districtName: string;
  address?: string | null;
  createdAt: string;
  ownerId: number | null;
}

export interface ListingFilter {
  districtId: number | null;
  maxPrice: number | null;
}

export interface District {
  id: number;
  name: string;
  listingsCount: number;
}

// Данные для создания и редактирования объявления
export interface ListingRequest {
  title: string;
  price: number;
  rooms: number;
  districtId: number;
  address: string | null;
}