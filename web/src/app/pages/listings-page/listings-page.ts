import { Component, computed, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';

import {
  District,
  Listing,
  ListingFilter as FilterValue
} from '../../models/listing';

import { ListingApi } from '../../services/listing-api';
import { ErrorMessagePipe } from '../../pipes/error-message.pipe';
import { ListingFilter } from '../../listing-filter/listing-filter';
import { ListingList } from '../../listing-list/listing-list';

@Component({
  selector: 'app-listings-page',
  imports: [
    ListingFilter,
    ListingList,
    ErrorMessagePipe
  ],
  templateUrl: './listings-page.html',
  styleUrl: './listings-page.css'
})
export class ListingsPage {
  private api = inject(ListingApi);

  filter = signal<FilterValue>({
    districtId: null,
    maxPrice: null
  });

  listings = httpResource<Listing[]>(() => ({
    url: this.api.listingsUrl,
    params: this.api.toParams(this.filter())
  }));

  districts = httpResource<District[]>(
    () => this.api.districtsUrl,
    { defaultValue: [] }
  );

  total = computed(() =>
    this.districts.value().reduce(
      (sum, district) => sum + district.listingsCount,
      0
    )
  );

   onFilter(value: FilterValue) {
    this.filter.set(value);
  }

  refresh() {
    this.listings.reload();
    this.districts.reload();
  }
}