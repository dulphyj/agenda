// src/app/features/admin/pages/contact-management/contact-management.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../../../core/services/agenda';
import { environment } from '../../../../../environments/environment';
import { ColorPicker } from '../../components/color-picker/color-picker';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Theme } from '../../../../core/services/theme';

@Component({
  selector: 'app-contact-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPicker, RouterModule],
  templateUrl: './contact-management.html'
})
export class ContactManagement implements OnInit {
  private agendaService = inject(AgendaService);
  private themeService = inject(Theme);

  clientId = environment.viceClientId;

  contactos$!: Observable<any>;
  grupos$!: Observable<any>;

  nuevoContacto: any = {
    nombreCompleto: '',
    celular: '',
    email: '',
    cargo: '',
    grupoId: '',
    clientId: this.clientId
  };

  ngOnInit() {
    this.contactos$ = this.agendaService.getContactosByClient(this.clientId);
    this.grupos$ = this.agendaService.getLabelsByClient(this.clientId);
  }

  guardarContacto() {
    if (!this.nuevoContacto.nombreCompleto || !this.nuevoContacto.grupoId) return;
    this.agendaService.saveContacto({ ...this.nuevoContacto }).then(() => {
      this.nuevoContacto = { nombreCompleto: '', celular: '', email: '', cargo: '', grupoId: '', clientId: this.clientId };
    });
  }
  toggleTheme() {
    const nuevoTema = this.themeService.getTheme() === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(nuevoTema);
  }
}