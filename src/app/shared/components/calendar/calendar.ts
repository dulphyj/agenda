// src/app/shared/components/calendar/calendar.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ratio ratio-16x9 shadow-lg rounded-4 overflow-hidden border bg-white">
      <iframe [src]="calendarUrl" style="border: 0" frameborder="0" scrolling="no"></iframe>
    </div>
  `
})
export class Calendar implements OnInit {
  private sanitizer = inject(DomSanitizer);
  calendarUrl!: SafeResourceUrl;

  ngOnInit() {
    // El ID de calendario de tu imagen
    const calendarId = 'mopsvpntv@gmail.com';
    const url = `https://calendar.google.com/calendar/embed?src=${calendarId}&ctz=America%2FLa_Paz&mode=MONTH&showNav=1&showPrint=0&showTabs=1&showCalendars=0`;
    this.calendarUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}