import { Component, computed, signal } from '@angular/core';
import { Listing, ListingFilter as FilterValue } from './models/listing';
import { MOCK_LISTINGS } from './data/mock-listings';
import { ListingList } from './listing-list/listing-list';
import { ListingFilter, DistrictOption } from './listing-filter/listing-filter';
import { ListingDetails } from './listing-details/listing-details';
@Component({
  selector: 'app-root',
imports: [ListingList, ListingFilter, ListingDetails],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  listings = signal<Listing[]>(MOCK_LISTINGS);

  selectedId = signal<number | null>(null);

  filter = signal<FilterValue>({
    districtId: null,
    maxPrice: null
  });

  selectedListing = computed(() =>
    this.listings().find(l => l.id === this.selectedId()) ?? null
  );

  districts = computed<DistrictOption[]>(() => {
    const map = new Map<number, string>();

    for (const l of this.listings()) {
      map.set(l.districtId, l.districtName);
    }

    return [...map]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  filtered = computed(() => {
    const { districtId, maxPrice } = this.filter();

    return this.listings().filter(l =>
      (districtId === null || l.districtId === districtId) &&
      (maxPrice === null || l.price <= maxPrice)
    );
  });

  onSelect(id: number) {
    this.selectedId.update(current => current === id ? null : id);
  }

  onFilter(value: FilterValue) {
    this.filter.set(value);
    this.selectedId.set(null);
  }

  addTestListing() {
    this.listings.update(items => [
      ...items,
      {
        id: Math.max(0, ...items.map(l => l.id)) + 1,
        title: 'Тестовое объявление',
        price: 50000,
        rooms: 2,
        districtId: 1,
        districtName: 'Чиланзар',
        createdAt: new Date().toISOString(),
        address: 'Тестовый адрес'
      }
    ]);
  }
}