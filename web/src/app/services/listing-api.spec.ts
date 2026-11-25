import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Listing } from '../models/listing';

export interface CreateListingRequest {
  title: string;
  price: number;
  rooms: number;
  districtId: number;
  address: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ListingApiService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5165/api/listings';

  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.apiUrl);
  }

  createListing(request: CreateListingRequest): Observable<Listing> {
    return this.http.post<Listing>(this.apiUrl, request);
  }
}