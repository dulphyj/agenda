// src/app/core/services/user.service.ts
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import { firstValueFrom, Observable } from 'rxjs';
import { deleteDoc, updateDoc } from 'firebase/firestore/lite';

@Injectable({ providedIn: 'root' })
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async registrarAsistente(email: string, pass: string, nombre: string, whatsapp: string) {
    // AQUÍ SE ENVÍA LA CONTRASEÑA A FIREBASE AUTH
    const res = await createUserWithEmailAndPassword(this.auth, email, pass);

    const perfil: Usuario = {
      uid: res.user.uid,
      email: email,
      role: 'asistente',
      clientId: 'viceministro'
    };

    // Guardamos los datos extras en Firestore
    return setDoc(doc(this.firestore, `usuarios/${res.user.uid}`), {
      ...perfil,
      displayName: nombre,
      whatsappNumber: whatsapp,
      isActiveWA: false // Por defecto desactivado
    });
  }

  getUsuarios(): Observable<Usuario[]> {
    const ref = collection(this.firestore, 'usuarios');
    return collectionData(ref, { idField: 'uid' }) as Observable<Usuario[]>;
  }

  async setWhatsAppActivo(uid: string, numero: string) {
    // 1. Desactivar a todos primero
    const usuarios = await firstValueFrom(this.getUsuarios());
    for (let u of usuarios) {
      await setDoc(doc(this.firestore, `usuarios/${u.uid}`), { isActiveWA: false }, { merge: true });
    }
    // 2. Activar al elegido
    await setDoc(doc(this.firestore, `usuarios/${uid}`), { isActiveWA: true }, { merge: true });
    // 3. Opcional: Actualizar el dato maestro en clientes
    await setDoc(doc(this.firestore, 'clientes/viceministro'), { whatsappNumber: numero }, { merge: true });
  }

  async updateUser(uid: string, data: Partial<Usuario>) {
    const userRef = doc(this.firestore, `usuarios/${uid}`);
    return updateDoc(userRef, data);
  }

  async deleteUser(uid: string) {
    const userRef = doc(this.firestore, `usuarios/${uid}`);
    return deleteDoc(userRef);
  }
}