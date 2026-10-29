import { Component, computed, input, output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Listing } from '../models/listing';

@Component({
  selector: 'app-listing-card',
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './listing-card.html',
  styleUrl: './listing-card.css'
})
export class ListingCard {
  listing = input.required<Listing>();
  active = input(false);
  selected = output<number>();

  isCheap = computed(() => this.listing().price < 40000);

  roomsLabel = computed(() => {
    const r = this.listing().rooms;
    return r === 1 ? 'студия' : `${r} комн.`;
  });

  choose() {
    this.selected.emit(this.listing().id);
  }
}