import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface Listing {
  id: number;
  title: string;
  price: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private http = inject(HttpClient);

  listings = signal<Listing[]>([]);

  constructor() {
    this.http
      .get<Listing[]>('http://localhost:5165/api/listings')
      .subscribe(data => this.listings.set(data));
  }
}