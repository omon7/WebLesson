import {
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';

import {
  httpResource,
  HttpErrorResponse
} from '@angular/common/http';

import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { Listing } from '../../models/listing';
import { ListingApi } from '../../services/listing-api';
import { AuthService } from '../../services/auth.service';

import {
  ErrorMessagePipe,
  errorMessage
} from '../../pipes/error-message.pipe';

import { ListingDetails } from '../../listing-details/listing-details';

@Component({
  selector: 'app-listing-page',
  imports: [
    ListingDetails,
    ErrorMessagePipe,
    RouterLink
  ],
  templateUrl: './listing-page.html',
  styleUrl: './listing-page.css'
})
export class ListingPage {
  private api = inject(ListingApi);
  private router = inject(Router);
  private auth = inject(AuthService);

  id = input.required<string>();

  listing = httpResource<Listing>(
    () => this.api.listingUrl(this.id())
  );

  // Показываем кнопки только владельцу объявления
  canEdit = computed(() =>
    this.listing.hasValue() &&
    this.listing.value().ownerId === this.auth.userId()
  );

  deleting = signal(false);
  deleteError = signal<string | null>(null);

  isNotFoundError(err: unknown): boolean {
    return err instanceof HttpErrorResponse &&
      err.status === 404;
  }

  async remove() {
    if (!confirm('Удалить объявление?')) {
      return;
    }

    this.deleting.set(true);
    this.deleteError.set(null);

    try {
      await firstValueFrom(
        this.api.delete(Number(this.id()))
      );

      await this.router.navigate(['/']);
    } catch (e) {
      this.deleteError.set(errorMessage(e));
    } finally {
      this.deleting.set(false);
    }
  }
}