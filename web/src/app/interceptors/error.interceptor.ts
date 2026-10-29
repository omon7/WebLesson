import { HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    tap({
      error: (err) =>
        console.error(`[API] ${req.method} ${req.url} → ${err.status}`)
    })
  );