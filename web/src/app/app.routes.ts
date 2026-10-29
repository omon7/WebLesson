import { Routes } from '@angular/router';
import { ListingsPage } from './pages/listings-page/listings-page';
import { ListingPage } from './pages/listing-page/listing-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [
  {
    path: '',
    component: ListingsPage,
    title: 'Объявления'
  },
  {
    path: 'listings/:id',
    component: ListingPage,
    title: 'Объявление'
  },
  {
    path: '**',
    component: NotFoundPage,
    title: 'Страница не найдена'
  }
];