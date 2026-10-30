import { HttpErrorResponse } from '@angular/common/http';

export function problemErrors(
  e: unknown
): Record<string, string[]> | null {
  if (
    e instanceof HttpErrorResponse &&
    e.status === 400 &&
    e.error?.errors
  ) {
    return e.error.errors as Record<string, string[]>;
  }

  return null;
}