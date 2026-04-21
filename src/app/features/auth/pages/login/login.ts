import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore'; // Importar esto
import { Usuario } from '../../../../core/models/usuario';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';
  error = '';

  // Usando inject para evitar líos de contexto
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);

  // login.ts -> método ingresar()
  async ingresar() {
    try {
      const res = await signInWithEmailAndPassword(this.auth, this.email, this.password);

      // FORZAR lectura de Firestore para saber el ROL
      const userSnap = await getDoc(doc(this.firestore, `usuarios/${res.user.uid}`));
      const userData = userSnap.data() as Usuario;

      if (userData && userData.role === 'super-admin') {
        this.router.navigate(['/super-admin']);
      } else if (userData && userData.role === 'asistente') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']); // Si no tiene rol, al portal
      }
    } catch (e) {
      this.error = 'Credenciales inválidas';
    }
  }
}