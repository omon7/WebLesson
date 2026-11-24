
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

  favorites = signal<Set<number>>(new Set<number>());

  filter = signal<FilterValue>({
    districtId: null,
    maxPrice: null,
    sort: 'newest',
    favoritesOnly: false
  });

  selectedListing = computed(() =>
    this.listings().find(l => l.id === this.selectedId()) ?? null
  );

  districts = computed<DistrictOption[]>(() => {
    const map = new Map<number, { name: string; count: number }>();

    for (const listing of this.listings()) {
      const existing = map.get(listing.districtId);

      if (existing) {
        existing.count++;
      } else {
        map.set(listing.districtId, {
          name: listing.districtName,
          count: 1
        });
      }
    }

    return [...map]
      .map(([id, value]) => ({
        id,
        name: value.name,
        count: value.count
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  filtered = computed(() => {
    const { districtId, maxPrice, favoritesOnly } = this.filter();

    return this.listings().filter(listing =>
      (districtId === null || listing.districtId === districtId) &&
      (maxPrice === null || listing.price <= maxPrice) &&
      (!favoritesOnly || this.favorites().has(listing.id))
    );
  });

  sorted = computed(() => {
    const result = [...this.filtered()];
    const sort = this.filter().sort;

    if (sort === 'price-asc') {
      return result.sort((a, b) => a.price - b.price);
    }

    if (sort === 'price-desc') {
      return result.sort((a, b) => b.price - a.price);
    }

    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  });

  onSelect(id: number) {
    this.selectedId.update(current => current === id ? null : id);
  }

  onFilter(value: FilterValue) {
    this.filter.set(value);
    this.selectedId.set(null);
  }

  toggleFavorite(id: number) {
    this.favorites.update(current => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
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
