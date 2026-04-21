import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../../../core/services/agenda';
import { Contacto } from '../../../../core/models/contacto';
import { Observable } from 'rxjs';
import { Cita } from '../../../../core/models/cita';

@Component({
  selector: 'app-agenda-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agenda-form.html'
})
export class AgendaForm implements OnInit {
  @Input() clientId: string = '';
  private agendaService = inject(AgendaService);

  contactos$!: Observable<Contacto[]>;
  grupos: any[] = [];
  contactoSeleccionado: any = null;

  nuevaCita: any = {
    title: '',
    contactId: '',
    contactName: '',
    date: '',
    labelId: '',
    clientId: '',
    motivo: '',
    duracion: 60,
    ubicacion: ''
  };

  ngOnInit() {
    this.nuevaCita.clientId = this.clientId;
    this.contactos$ = this.agendaService.getContactosByClient(this.clientId);
    this.agendaService.getLabelsByClient(this.clientId).subscribe(res => {
      this.grupos = res;
    });
  }

  getGrupoNombre(grupoId: string): string {
    const grupo = this.grupos.find(g => g.id === grupoId);
    return grupo ? grupo.name : 'Sin Grupo';
  }

  onContactoChange(contacto: Contacto) {
    if (contacto) {
      this.nuevaCita.contactName = contacto.nombreCompleto;
      this.nuevaCita.contactId = contacto.id;
      this.nuevaCita.labelId = contacto.grupoId;
    }
  }

  async guardar() {
    if (!this.nuevaCita.title || !this.nuevaCita.date) return;
    const grupoSeleccionado = this.grupos.find(g => g.id === this.nuevaCita.labelId);
    const googleColorId = grupoSeleccionado?.googleId || '1';
    const data: Cita = {
      ...this.nuevaCita,
      date: new Date(this.nuevaCita.date)
    };
    try {
      await this.agendaService.saveCita(data);

      this.agendaService.addToGoogleCalendar(data, googleColorId).subscribe({
        next: () => {
          this.agendaService.notifyCalendarUpdate();
          alert('¡Cita agendada y sincronizada con Google!');
          this.limpiarForm();
        },
        error: (err) => {
          console.log('Detalle técnico (ignorar si sincroniza):', err);
          this.agendaService.notifyCalendarUpdate();
          this.limpiarForm();
        }
      });
    } catch (error) {
      console.error('Error en Firebase:', error);
    }
  }

  limpiarForm() {
    this.nuevaCita = {
      ...this.nuevaCita,
      title: '',
      contactName: '',
      date: '',
      motivo: '',
      ubicacion: ''
    };
    this.contactoSeleccionado = null;
  }
}