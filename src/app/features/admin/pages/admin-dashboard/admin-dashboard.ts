import { Component, OnInit, inject } from '@angular/core';
import { AgendaService } from '../../../../core/services/agenda';
import { Theme } from '../../../../core/services/theme';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Cita } from '../../../../core/models/cita';
import { AgendaForm } from "../../components/agenda-form/agenda-form";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Calendar } from "../../../../shared/components/calendar/calendar";
import { Header } from "../../../../shared/components/header/header";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  imports: [CommonModule, AgendaForm, RouterModule, Calendar, Header]
})
export class AdminDashboard implements OnInit {
  private agendaService = inject(AgendaService);
  private themeService = inject(Theme);

  citas$!: Observable<Cita[]>;
  grupos: any[] = [];
  clientId = environment.viceClientId;

  ngOnInit() {
    this.agendaService.getLabelsByClient(this.clientId).subscribe(res => {
      this.grupos = res;
      console.log('Grupos cargados:', this.grupos);
      this.citas$ = this.agendaService.getCitasByClient(this.clientId);
    });
  }

  getGrupoInfo(grupoId: string) {
    if (!grupoId || this.grupos.length === 0) return null;
    const encontrado = this.grupos.find(g => g.id === grupoId);
    return encontrado || null;
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