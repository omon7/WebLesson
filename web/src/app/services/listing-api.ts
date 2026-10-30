import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from '../../environments/environment';

import {
  District,
  Listing,
  ListingFilter,
  ListingRequest
} from '../models/listing';

@Injectable({
  providedIn: 'root'
})
export class ListingApi {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  listingsUrl = `${this.base}/api/listings`;
  districtsUrl = `${this.base}/api/districts`;

  listingUrl = (id: number | string) =>
    `${this.base}/api/listings/${id}`;

  toParams(filter: ListingFilter): Record<string, string | number> {
    const params: Record<string, string | number> = {};

    if (filter.districtId !== null) {
      params['districtId'] = filter.districtId;
    }

    if (filter.maxPrice !== null) {
      params['maxPrice'] = filter.maxPrice;
    }

    return params;
  }

  getAll(filter: ListingFilter) {
    return this.http.get<Listing[]>(this.listingsUrl, {
      params: new HttpParams({
        fromObject: this.toParams(filter)
      })
    });
  }

  getOne(id: number) {
    return this.http.get<Listing>(this.listingUrl(id));
  }

  getDistricts() {
    return this.http.get<District[]>(this.districtsUrl);
  }

  delete(id: number) {
    return this.http.delete<void>(this.listingUrl(id));
  }

  create(r: ListingRequest) {
    return this.http.post<Listing>(this.listingsUrl, r);
  }

  update(id: number, r: ListingRequest) {
    return this.http.put<void>(this.listingUrl(id), r);
  }
}