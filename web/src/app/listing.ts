export interface Listing {
  id: number;
  title: string;
  price: number;
  districtId: number;
  districtName: string;
  rooms: number;
  address: string | null;
  createdAt: string;
}