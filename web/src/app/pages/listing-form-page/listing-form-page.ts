import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal
} from '@angular/core';

import { httpResource } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import {
  form,
  FormField,
  required,
  min,
  max,
  minLength,
  maxLength,
  submit,
  FieldTree,
  ValidationError
} from '@angular/forms/signals';

import {
  District,
  Listing,
  ListingRequest
} from '../../models/listing';

import { ListingApi } from '../../services/listing-api';
import { ErrorMessagePipe, errorMessage } from '../../pipes/error-message.pipe';
import { problemErrors } from '../../utils/problem-details';

interface ListingFormModel {
  title: string;
  price: number;
  rooms: number;
  districtId: string;
  address: string;
}

const EMPTY: ListingFormModel = {
  title: '',
  price: 0,
  rooms: 1,
  districtId: '',
  address: ''
};

@Component({
  selector: 'app-listing-form-page',
  imports: [FormField, RouterLink, ErrorMessagePipe],
  templateUrl: './listing-form-page.html',
  styleUrl: './listing-form-page.css'
})
export class ListingFormPage {
  private api = inject(ListingApi);
  private router = inject(Router);

  id = input<string>();

  isEdit = computed(() => !!this.id());

  districts = httpResource<District[]>(
    () => this.api.districtsUrl,
    { defaultValue: [] }
  );

  listing = httpResource<Listing>(() =>
    this.id() ? this.api.listingUrl(this.id()!) : undefined
  );

  model = signal<ListingFormModel>({ ...EMPTY });

  listingForm = form(this.model, (s) => {
    required(s.title, { message: 'Укажите заголовок' });
    minLength(s.title, 5, { message: 'Не короче 5 символов' });
    maxLength(s.title, 200, { message: 'Не длиннее 200 символов' });

    min(s.price, 1, { message: 'Цена больше 0' });

    min(s.rooms, 1, { message: 'Комнат — от 1 до 10' });
    max(s.rooms, 10, { message: 'Комнат — от 1 до 10' });

    required(s.districtId, { message: 'Выберите район' });

    maxLength(s.address, 300, {
      message: 'Не длиннее 300 символов'
    });
  });

  generalError = signal<string | null>(null);

  constructor() {
    effect(() => {
      const l = this.listing.value();

      if (l) {
        this.model.set({
          title: l.title,
          price: l.price,
          rooms: l.rooms,
          districtId: String(l.districtId),
          address: l.address ?? ''
        });
      }
    });
  }

  async save(event: Event) {
    event.preventDefault();

    await submit(this.listingForm, async () => {
      this.generalError.set(null);

      try {
        const id = await this.persist(this.toRequest());

        this.router.navigate(['/listings', id]);

        return undefined;
      } catch (e) {
        const errors = problemErrors(e);

        if (errors) {
          return this.toFormErrors(errors);
        }

        this.generalError.set(errorMessage(e));

        return undefined;
      }
    });
  }

  private toRequest(): ListingRequest {
    const v = this.model();

    return {
      title: v.title.trim(),
      price: v.price,
      rooms: v.rooms,
      districtId: Number(v.districtId),
      address: v.address.trim() || null
    };
  }

  private async persist(r: ListingRequest): Promise<number> {
    if (this.isEdit()) {
      const id = Number(this.id());

      await firstValueFrom(this.api.update(id, r));

      return id;
    }

    const created = await firstValueFrom(this.api.create(r));

    return created.id;
  }

  private toFormErrors(
    errors: Record<string, string[]>
  ): ValidationError.WithOptionalFieldTree[] {
    const f = this.listingForm;

    const fields: Record<string, FieldTree<unknown>> = {
      title: f.title,
      price: f.price,
      rooms: f.rooms,
      districtId: f.districtId,
      address: f.address
    };

    return Object.entries(errors).flatMap(([key, messages]) =>
      messages.map((message) => ({
        kind: 'server',
        message,
        fieldTree: fields[key]
      }))
    );
  }
}