// src/app/shared/components/header/header.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Theme } from '../../../core/services/theme';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html'
})
export class Header {
  public themeService = inject(Theme);
  logoLight = 'assets/logo-negro.png';
  logoDark = 'assets/logo-blanco.png';

  toggleTheme() {
    const nuevoTema = this.themeService.getTheme() === 'light' ? 'dark' : 'light';
    this.themeService.setTheme(nuevoTema);
  }
}