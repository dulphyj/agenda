import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Theme {
  private theme: 'light' | 'dark' = 'light';

  setTheme(theme: 'light' | 'dark') {
    this.theme = theme;
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
  }

  getTheme() {
    return localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  }
}