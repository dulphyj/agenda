import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalRoutingModule } from './portal-routing-module';
import { PortalView } from './pages/portal-view/portal-view';
import { WhatsappButton } from '../../shared/components/whatsapp-button/whatsapp-button';
import { Calendar } from '../../shared/components/calendar/calendar';

@NgModule({

  imports: [
    CommonModule,
    PortalRoutingModule,
    PortalView,
    WhatsappButton,
    Calendar
  ]
})
export class PortalModule { }