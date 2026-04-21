// src/app/shared/components/calendar/calendar.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AgendaService } from '../../../core/services/agenda';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="width: 100%; height: 600px; background: #eee; display: flex; align-items: center; justify-content: center;" *ngIf="!calendarUrl">
      Cargando calendario...
    </div>
    <iframe *ngIf="calendarUrl" 
            [src]="calendarUrl" 
            style="border: 0" 
            width="100%" 
            height="600" 
            frameborder="0" 
            scrolling="no">
    </iframe>
  `
})
export class Calendar implements OnInit {
  calendarUrl: SafeResourceUrl | null = null;
  private agendaService = inject(AgendaService);
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadCalendar();
    this.agendaService.refreshCalendar$.subscribe(() => this.loadCalendar());
  }

  loadCalendar() {
    const email = environment.email;
    const timestamp = new Date().getTime();
    const url = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(email)}&ctz=America%2FLa_Paz&mode=WEEK&t=${timestamp}`;
    this.calendarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}