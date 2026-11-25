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

export interface UpdateListingRequest {
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

  // Получить все квартиры
  getListings(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.apiUrl);
  }

  // Добавить квартиру
  createListing(request: CreateListingRequest): Observable<Listing> {
    return this.http.post<Listing>(this.apiUrl, request);
  }

  // Изменить квартиру
  updateListing(id: number, request: UpdateListingRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, request);
  }

  // Удалить квартиру
  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}