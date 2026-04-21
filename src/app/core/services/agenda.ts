// src/app/core/services/agenda.ts
import { Injectable, inject } from '@angular/core'; // Añadir inject
import { Firebase } from './firebase';
import { Cita } from '../models/cita';
import { Agenda } from '../models/agenda';
import { Contacto } from '../models/contacto';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
  addDoc,
  doc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);

  constructor(private fb: Firebase) { }

  getCitasByClient(clientId: string) {
    return this.fb.getCollection<Cita>('citas', 'clientId', clientId);
  }

  getLabelsByClient(clientId: string) {
    return this.fb.getCollection<Agenda>('labels', 'clientId', clientId);
  }

  saveCita(cita: Cita) {
    return this.fb.createDoc('citas', cita);
  }

  deleteCita(id: string) {
    return this.fb.deleteDoc('citas', id);
  }

  saveLabel(label: Agenda) {
    return this.fb.createDoc('labels', label);
  }

  // --- MÉTODOS DE CONTACTOS CORREGIDOS ---

  getContactosByClient(clientId: string): Observable<Contacto[]> {
    const ref = collection(this.firestore, 'contactos');
    const q = query(ref, where('clientId', '==', clientId));
    // El "as Observable<Contacto[]>" es la clave aquí
    return collectionData(q, { idField: 'id' }) as Observable<Contacto[]>;
  }

  saveContacto(contacto: Contacto) {
    const ref = collection(this.firestore, 'contactos');
    return addDoc(ref, contacto);
  }

  deleteContacto(id: string) {
    return deleteDoc(doc(this.firestore, `contactos/${id}`));
  }

  // src/app/core/services/agenda.ts

  async addToGoogleCalendar(cita: any) {
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwu-R70P3wEul6GOxIDqBIdEsxqi0kBB_w1ECn0Ao51PYMYrvXYHhKbPa7dsz_zE-6BiA/exec';

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Fundamental para saltar errores de seguridad
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: cita.title,
          contactName: cita.contactName,
          date: cita.date.toISOString()
        })
      });
      console.log('Sincronización enviada a Google');
    } catch (error) {
      console.error('Error enviando a Google:', error);
    }
  }
}