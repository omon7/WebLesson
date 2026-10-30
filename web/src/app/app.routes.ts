import { Routes } from '@angular/router';

import { ListingsPage } from './pages/listings-page/listings-page';
import { ListingPage } from './pages/listing-page/listing-page';
import { ListingFormPage } from './pages/listing-form-page/listing-form-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';

export const routes: Routes = [
  {
    path: '',
    component: ListingsPage,
    title: 'Объявления'
  },
  {
    path: 'listings/new',
    component: ListingFormPage,
    title: 'Новое объявление'
  },
  {
    path: 'listings/:id/edit',
    component: ListingFormPage,
    title: 'Редактирование'
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