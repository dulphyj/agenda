import { Firebase } from '../../../../core/services/firebase';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { WhatsappButton } from "../../../../shared/components/whatsapp-button/whatsapp-button";
import { Calendar } from "../../../../shared/components/calendar/calendar";
import { Theme } from '../../../../core/services/theme';
import { Client } from '../../../../core/models/client';
import { Observable } from 'rxjs';
import { Usuario } from '../../../../core/models/usuario';
import { Component, OnInit, inject } from '@angular/core';
import { Firestore, collection, query, where, collectionData } from '@angular/fire/firestore';

@Component({
  selector: 'app-portal-view',
  standalone: true,
  imports: [CommonModule, WhatsappButton, Calendar],
  templateUrl: './portal-view.html'
})
export class PortalView implements OnInit {
  client$!: Observable<Client>;
  asistenteActivo$!: Observable<Usuario[]>;
  clientId = environment.viceClientId;
  logoActual: string = 'assets/logo-negro.png';
  private firestore = inject(Firestore);

  constructor(private fb: Firebase, private themeService: Theme) { }

  ngOnInit() {
    const userRef = collection(this.firestore, 'usuarios');
    const q = query(userRef, where('isActiveWA', '==', true));
    this.asistenteActivo$ = collectionData(q, { idField: 'uid' }) as Observable<Usuario[]>;
    const temaGuardado = this.themeService.getTheme();
    this.themeService.setTheme(temaGuardado);
    this.actualizarLogo(temaGuardado);
    this.client$ = this.fb.getDocData<Client>('clientes', this.clientId);
  }

  toggleTheme() {
    const nuevoTema = this.themeService.getTheme() === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(nuevoTema);
    this.actualizarLogo(nuevoTema);
  }

  actualizarLogo(tema: string) {
    this.logoActual = tema === 'dark' ? 'assets/logo-blanco.png' : 'assets/logo-negro.png';
  }
}