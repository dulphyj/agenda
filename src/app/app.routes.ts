// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; // Importar el guard corregido

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./features/portal/pages/portal-view/portal-view').then(m => m.PortalView)
    },
    {
        path: 'admin',
        canActivate: [authGuard],
        loadChildren: () => import('./features/admin/admin-module').then(m => m.AdminModule)
    },
    {
        path: 'super-admin',
        canActivate: [authGuard],
        loadChildren: () => import('./features/super-admin/super-admin-module').then(m => m.SuperAdminModule)
    },
    {
        path: 'login',
        loadComponent: () => import('./features/auth/pages/login/login').then(m => m.Login)
    },
    {
        path: '**',
        redirectTo: ''
    }
];