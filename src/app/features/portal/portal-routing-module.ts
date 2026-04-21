import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PortalView } from './pages/portal-view/portal-view';

const routes: Routes = [
  { path: '', component: PortalView }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PortalRoutingModule { }