// src/app/core/services/firebase.ts
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, addDoc, getDoc, updateDoc, query, where, setDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class Firebase {
  deleteDoc(arg0: string, id: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) { }

  getCollection<T>(path: string, filterField?: string, filterValue?: any): Observable<T[]> {
    const ref = collection(this.firestore, path);
    if (filterField && filterValue) {
      const q = query(ref, where(filterField, '==', filterValue));
      return collectionData(q, { idField: 'id' }) as Observable<T[]>;
    }
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  createDoc(path: string, data: any) {
    const ref = collection(this.firestore, path);
    return addDoc(ref, data);
  }

  updateDoc(path: string, id: string, data: any) {
    const ref = doc(this.firestore, `${path}/${id}`);
    return updateDoc(ref, data);
  }

  async getClientByLoggedUser() {
    const user = this.auth.currentUser;
    if (!user) return null;
    const userDoc = await getDoc(doc(this.firestore, `usuarios/${user.uid}`));
    return userDoc.exists() ? userDoc.data()?.['clientId'] : null;
  }

  async crearAsistente(email: string, pass: string, clientId: string) {
    const res = await createUserWithEmailAndPassword(this.auth, email, pass);
    return setDoc(doc(this.firestore, `usuarios/${res.user.uid}`), {
      clientId: clientId,
      role: 'asistente'
    });
  }

  getDocData<T>(path: string, id: string): Observable<T> {
    const ref = doc(this.firestore, `${path}/${id}`);
    return docData(ref, { idField: 'id' }) as Observable<T>;
  }
}