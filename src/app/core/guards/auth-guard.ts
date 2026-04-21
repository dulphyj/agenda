// src/app/core/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { map, switchMap, take, from, of } from 'rxjs';
import { Usuario } from '../models/usuario';

export const authGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const firestore = inject(Firestore);
  const router = inject(Router);

  return user(auth).pipe(
    take(1),
    switchMap(u => {
      if (!u) return of(router.createUrlTree(['/login']));

      return from(getDoc(doc(firestore, `usuarios/${u.uid}`))).pipe(
        map(snap => {
          const userData = snap.data() as Usuario;
          const path = route.routeConfig?.path;

          if (userData?.role === 'super-admin' && path === 'super-admin') return true;
          if (userData?.role === 'asistente' && path === 'admin') return true;

          return router.createUrlTree(['/']);
        })
      );
    })
  );
};