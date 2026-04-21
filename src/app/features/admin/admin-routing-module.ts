import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { ContactManagement } from './pages/contact-management/contact-management';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'contactos', component: ContactManagement },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }