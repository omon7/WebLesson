import { Component, computed, input, output, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Listing } from '../models/listing';
import { UpdateListingRequest } from '../services/listing-api';

@Component({
  selector: 'app-listing-details',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './listing-details.html',
  styleUrl: './listing-details.css'
})
export class ListingDetails {
  listing = input.required<Listing>();

  closed = output<void>();
  deleteRequested = output<number>();

  updateRequested = output<{
    id: number;
    request: UpdateListingRequest;
  }>();

  editing = signal(false);
  editTitle = signal('');
  editPrice = signal(0);
  editRooms = signal(1);
  editAddress = signal('');

  perRoom = computed(() =>
    Math.round(this.listing().price / this.listing().rooms)
  );

  deleteListing() {
    this.deleteRequested.emit(this.listing().id);
  }

  startEdit() {
    const item = this.listing();

    this.editTitle.set(item.title);
    this.editPrice.set(item.price);
    this.editRooms.set(item.rooms);
    this.editAddress.set(item.address ?? '');

    this.editing.set(true);
  }

  cancelEdit() {
    this.editing.set(false);
  }

  saveEdit() {
    const item = this.listing();

    this.updateRequested.emit({
      id: item.id,
      request: {
        title: this.editTitle(),
        price: this.editPrice(),
        rooms: this.editRooms(),
        districtId: item.districtId,
        address: this.editAddress() || null
      }
    });

    this.editing.set(false);
  }
}