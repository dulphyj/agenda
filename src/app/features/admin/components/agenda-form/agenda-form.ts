// src/app/features/admin/components/agenda-form/agenda-form.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../../../core/services/agenda';
import { Contacto } from '../../../../core/models/contacto';
import { Agenda } from '../../../../core/models/agenda';
import { Observable } from 'rxjs';
import { ColorPicker } from '../color-picker/color-picker';
import { Cita } from '../../../../core/models/cita';

@Component({
  selector: 'app-agenda-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPicker],
  templateUrl: './agenda-form.html'
})
export class AgendaForm implements OnInit {
  @Input() clientId: string = '';
  private agendaService = inject(AgendaService);

  contactos$!: Observable<Contacto[]>;
  labels$!: Observable<Agenda[]>; // DECLARAR ESTA
  contactoSeleccionado: any = null;

  nuevaCita = {
    title: '',
    contactId: '',
    contactName: '',
    date: '',
    labelId: '',
    clientId: this.clientId,
    motivo: '',      // NUEVO
    duracion: 60,    // NUEVO (default 1 hora)
    ubicacion: ''    // NUEVO
  };

  ngOnInit() {
    this.contactos$ = this.agendaService.getContactosByClient(this.clientId);
    this.labels$ = this.agendaService.getLabelsByClient(this.clientId); // INICIALIZAR
    this.nuevaCita.clientId = this.clientId;
  }

  compareContactos(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onContactoChange(contacto: any) {
    if (contacto) {
      this.nuevaCita.contactName = contacto.nombreCompleto;
      this.nuevaCita.contactId = contacto.id;
      this.nuevaCita.labelId = contacto.grupoId; // El color del grupo
    }
  }

  async guardar() {
    if (!this.nuevaCita.contactId || !this.nuevaCita.date) {
      alert('Falta contacto o fecha');
      return;
    }

    const data: Cita = {
      ...this.nuevaCita,
      date: new Date(this.nuevaCita.date)
    };

    await this.agendaService.saveCita(data);
    await this.agendaService.addToGoogleCalendar(data); // El método que usa Apps Script

    this.limpiarForm();
    alert('Cita agendada con éxito');
  }

  limpiarForm() {
    this.nuevaCita = { ...this.nuevaCita, title: '', contactName: '', date: '' };
    this.contactoSeleccionado = null;
  }
}