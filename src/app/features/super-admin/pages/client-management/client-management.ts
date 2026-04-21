import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user';
import { firstValueFrom } from 'rxjs';
import { Usuario } from '../../../../core/models/usuario';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './client-management.html'
})
export class ClientManagement implements OnInit {
  usuarios$: any;
  nuevoNombre = '';
  nuevoEmail = '';
  nuevoPassword = '';
  nuevoWhatsApp = '';
  private userService = inject(UserService);
  private auth = inject(Auth);
  private router = inject(Router);

  ngOnInit() {
    this.usuarios$ = this.userService.getUsuarios();
  }

  async registrar() {
    if (!this.nuevoEmail || !this.nuevoPassword) return;
    try {
      await this.userService.registrarAsistente(
        this.nuevoEmail,
        this.nuevoPassword,
        this.nuevoNombre,
        this.nuevoWhatsApp
      );
      this.nuevoNombre = ''; this.nuevoEmail = ''; this.nuevoPassword = ''; this.nuevoWhatsApp = '';
      alert('Asistente creado con éxito');
    } catch (e: any) {
      alert('Error al crear: ' + e.message);
    }
  }

  async salir() {
    await this.auth.signOut();
    this.router.navigate(['/login']);
  }

  async toggleAsistente(user: any) {
    const nuevoEstado = !user.isActiveWA;

    if (nuevoEstado) {
      const todos = await firstValueFrom(this.usuarios$);
      for (const u of todos as Usuario[]) {
        if (u.isActiveWA) await this.userService.updateUser(u.uid, { isActiveWA: false });
      }
    }
    await this.userService.updateUser(user.uid, { isActiveWA: nuevoEstado });
  }

  async eliminar(uid: string) {
    if (confirm('¿Seguro?')) {
      await this.userService.deleteUser(uid);
    }
  }
}