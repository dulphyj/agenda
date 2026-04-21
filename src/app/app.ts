import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Theme } from './core/services/theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  isLight = true;

  constructor(private theme: Theme) { }

  toggleTheme() {
    this.isLight = !this.isLight;
    this.theme.setTheme(this.isLight ? 'light' : 'dark');
  }
}
