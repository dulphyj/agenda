import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  user$ = user(this.auth);

  async login(email: string, pass: string) {
    const credential = await signInWithEmailAndPassword(this.auth, email, pass);
    const userDoc = await getDoc(doc(this.firestore, `usuarios/${credential.user.uid}`));
    const userData = userDoc.data();

    if (userData?.['role'] === 'super-admin') {
      this.router.navigate(['/super-admin']);
    } else {
      this.router.navigate(['/admin']);
    }
    return credential;
  }
}