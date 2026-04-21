import { Injectable, inject } from '@angular/core';
import { Firebase } from './firebase';
import { Cita } from '../models/cita';
import { Agenda } from '../models/agenda';
import { Contacto } from '../models/contacto';
import { Grupo } from '../models/grupo';
import {
  Firestore,
  collection,
  query,
  where,
  collectionData,
  addDoc,
  doc,
  deleteDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AgendaService {
  private http = inject(HttpClient);
  private firestore = inject(Firestore);
  private refreshCalendarSource = new Subject<void>();
  refreshCalendar$ = this.refreshCalendarSource.asObservable();

  constructor(private fb: Firebase) { }

  getLabelsByClient(clientId: string): Observable<Grupo[]> {
    const ref = collection(this.firestore, 'labels');
    const q = query(ref, where('clientId', '==', clientId));
    return collectionData(q, { idField: 'id' }) as Observable<Grupo[]>;
  }

  getCitasByClient(clientId: string) {
    return this.fb.getCollection<Cita>('citas', 'clientId', clientId);
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

  getContactosByClient(clientId: string): Observable<Contacto[]> {
    const ref = collection(this.firestore, 'contactos');
    const q = query(ref, where('clientId', '==', clientId));
    return collectionData(q, { idField: 'id' }) as Observable<Contacto[]>;
  }

  saveContacto(contacto: Contacto) {
    const ref = collection(this.firestore, 'contactos');
    return addDoc(ref, contacto);
  }

  updateContacto(id: string, contacto: Partial<Contacto>) {
    const ref = doc(this.firestore, `contactos/${id}`);
    return updateDoc(ref, contacto);
  }

  deleteContacto(id: string) {
    return deleteDoc(doc(this.firestore, `contactos/${id}`));
  }

  addToGoogleCalendar(cita: any, googleColorId: string = '1'): Observable<any> {
    const SCRIPT_URL = environment.googleScriptUrl;

    const body = {
      title: cita.title,
      contactName: cita.contactName,
      date: cita.date.toISOString(),
      motivo: cita.motivo,
      duracion: cita.duracion,
      ubicacion: cita.ubicacion,
      colorId: googleColorId
    };

    return this.http.post(SCRIPT_URL, JSON.stringify(body), { responseType: 'text' });
  }

  notifyCalendarUpdate() {
    this.refreshCalendarSource.next();
  }
}