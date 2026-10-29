import { Pipe, PipeTransform } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export function errorMessage(err: unknown): string {
  if (err instanceof HttpErrorResponse) {
    switch (err.status) {
      case 0:
        return 'Сервер недоступен. Проверьте, что API запущен, и повторите.';
      case 400:
        return typeof err.error === 'string'
          ? err.error
          : 'Неверные данные запроса.';
      case 404:
        return 'Объявление не найдено.';
      case 500:
        return 'Ошибка на сервере. Попробуйте позже.';
      default:
        return `Ошибка ${err.status}.`;
    }
  }

  return 'Что-то пошло не так.';
}

@Pipe({ name: 'errorMessage' })
export class ErrorMessagePipe implements PipeTransform {
  transform(err: unknown): string {
    return errorMessage(err);
  }
}