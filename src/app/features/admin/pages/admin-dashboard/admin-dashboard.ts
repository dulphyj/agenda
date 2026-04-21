// src/app/features/admin/pages/admin-dashboard/admin-dashboard.ts
import { Component, OnInit, inject } from '@angular/core';
import { AgendaService } from '../../../../core/services/agenda';
import { Theme } from '../../../../core/services/theme';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Cita } from '../../../../core/models/cita';
import { AgendaForm } from "../../components/agenda-form/agenda-form";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  imports: [CommonModule, AgendaForm, RouterModule]
})
export class AdminDashboard implements OnInit {
  private agendaService = inject(AgendaService);
  private themeService = inject(Theme);

  citas$!: Observable<Cita[]>;
  clientId = environment.viceClientId;

  ngOnInit() {
    this.citas$ = this.agendaService.getCitasByClient(this.clientId);
  }

  toggleTheme() {
    const nuevoTema = this.themeService.getTheme() === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(nuevoTema);
  }

  eliminarCita(id?: string) {
    if (id && confirm('¿Eliminar cita?')) {
      this.agendaService.deleteCita(id);
    }
  }
}