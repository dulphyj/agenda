import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../../../core/services/agenda';
import { environment } from '../../../../../environments/environment';
import { ColorPicker } from '../../components/color-picker/color-picker';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';
import { Theme } from '../../../../core/services/theme';
import { Header } from "../../../../shared/components/header/header";

@Component({
  selector: 'app-contact-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ColorPicker, RouterModule, Header],
  templateUrl: './contact-management.html'
})
export class ContactManagement implements OnInit {
  editando = false;
  idEnEdicion: string | null = null;
  private agendaService = inject(AgendaService);
  private themeService = inject(Theme);

  clientId = environment.viceClientId;
  contactos$!: Observable<any>;
  grupos$!: Observable<any>;
  gruposList: any[] = [];

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
    this.grupos$.subscribe(res => this.gruposList = res);
  }

  getGrupoInfo(grupoId: string) {
    return this.gruposList.find(g => g.id === grupoId);
  }

  async guardarContacto() {
    if (!this.nuevoContacto.nombreCompleto || !this.nuevoContacto.grupoId) return;

    if (this.editando && this.idEnEdicion) {
      await this.agendaService.updateContacto(this.idEnEdicion, this.nuevoContacto);
      this.cancelarEdicion();
    } else {
      await this.agendaService.saveContacto({ ...this.nuevoContacto });
      this.resetForm();
    }
  }

  editar(contacto: any) {
    this.editando = true;
    this.idEnEdicion = contacto.id;
    // Cargamos los datos en el formulario
    this.nuevoContacto = { ...contacto };
  }

  cancelarEdicion() {
    this.editando = false;
    this.idEnEdicion = null;
    this.resetForm();
  }

  resetForm() {
    this.nuevoContacto = {
      nombreCompleto: '',
      celular: '',
      email: '',
      cargo: '',
      grupoId: '',
      clientId: this.clientId
    };
  }

  async eliminar(id: string) {
    if (confirm('¿Estás seguro de eliminar este contacto?')) {
      await this.agendaService.deleteContacto(id);
    }
  }
  toggleTheme() {
    const nuevoTema = this.themeService.getTheme() === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(nuevoTema);
  }


}