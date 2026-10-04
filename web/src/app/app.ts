import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Listing } from './listing';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private http = inject(HttpClient);

  listings = signal<Listing[]>([]);
  error = signal<string | null>(null);
  constructor() {
   this.http
  .get<Listing[]>('http://localhost:5000/api/listings')
  .subscribe({
    next: (data) => this.listings.set(data),
    error: (err) => this.error.set('Сервер недоступен: ' + err.message),
  });
  }
}