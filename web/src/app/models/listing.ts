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
}
export interface District {
  id: number;
  name: string;
  listingsCount: number;
}