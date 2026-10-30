import { Routes } from '@angular/router';

import { ListingsPage } from './pages/listings-page/listings-page';
import { ListingPage } from './pages/listing-page/listing-page';
import { ListingFormPage } from './pages/listing-form-page/listing-form-page';
import { LoginPage } from './pages/login-page/login-page';
import { RegisterPage } from './pages/register-page/register-page';
import { NotFoundPage } from './pages/not-found-page/not-found-page';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ListingsPage,
    title: 'Объявления'
  },
  {
    path: 'login',
    component: LoginPage,
    title: 'Вход'
  },
  {
    path: 'register',
    component: RegisterPage,
    title: 'Регистрация'
  },
  {
    path: 'listings/new',
    component: ListingFormPage,
    canActivate: [authGuard],
    title: 'Новое объявление'
  },
  {
    path: 'listings/:id/edit',
    component: ListingFormPage,
    canActivate: [authGuard],
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