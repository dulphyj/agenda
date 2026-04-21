// src/app/core/services/user.service.ts
import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Usuario } from '../models/usuario';
import { firstValueFrom, Observable } from 'rxjs';
import { deleteDoc, updateDoc } from 'firebase/firestore/lite';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async registrarAsistente(email: string, pass: string, nombre: string, whatsapp: string) {
    const res = await createUserWithEmailAndPassword(this.auth, email, pass);

    const perfil: Usuario = {
      uid: res.user.uid,
      email: email,
      role: 'asistente',
      clientId: environment.viceClientId,
    };

    return setDoc(doc(this.firestore, `usuarios/${res.user.uid}`), {
      ...perfil,
      displayName: nombre,
      whatsappNumber: whatsapp,
      isActiveWA: false
    });
  }

  getUsuarios(): Observable<Usuario[]> {
    const ref = collection(this.firestore, 'usuarios');
    return collectionData(ref, { idField: 'uid' }) as Observable<Usuario[]>;
  }

  async setWhatsAppActivo(uid: string, numero: string) {
    const usuarios = await firstValueFrom(this.getUsuarios());
    for (let u of usuarios) {
      await setDoc(doc(this.firestore, `usuarios/${u.uid}`), { isActiveWA: false }, { merge: true });
    }
    await setDoc(doc(this.firestore, `usuarios/${uid}`), { isActiveWA: true }, { merge: true });
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