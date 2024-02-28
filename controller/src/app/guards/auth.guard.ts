import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs';
import { LinkStorageService } from '../services/link-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const linkStorageService = inject(LinkStorageService);
  return authService.isAuthenticated().pipe(
    tap((value: boolean) => {
      if(value){
        return true;
      } else {
        linkStorageService.setLink(state.url);
        router.navigate(["/login"]);
        return false;
      }
      // return !value ? router.navigate(["/login"]): true
    })
  )
};
