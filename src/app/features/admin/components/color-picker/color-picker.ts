// src/app/features/admin/components/color-picker/color-picker.ts
import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../../../core/services/agenda';

@Component({
  selector: 'app-color-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './color-picker.html'
})
export class ColorPicker {
  @Input() clientId: string = '';
  private agendaService = inject(AgendaService);
  googleColors = [
    { id: '1', hex: '#a4bdfc' }, { id: '2', hex: '#7ae7bf' }, { id: '3', hex: '#dbadff' },
    { id: '4', hex: '#ff887c' }, { id: '5', hex: '#fbd75b' }, { id: '6', hex: '#ffb878' },
    { id: '7', hex: '#46d6db' }, { id: '8', hex: '#e1e1e1' }, { id: '9', hex: '#5484ed' },
    { id: '10', hex: '#51b749' }, { id: '11', hex: '#dc2127' }, { id: '12', hex: '#5484ed' },
    { id: '13', hex: '#51b749' }, { id: '14', hex: '#dbadff' }, { id: '15', hex: '#ffb878' },
    { id: '16', hex: '#ff887c' }, { id: '17', hex: '#fbd75b' }, { id: '18', hex: '#e1e1e1' },
    { id: '19', hex: '#46d6db' }, { id: '20', hex: '#7ae7bf' }, { id: '21', hex: '#a4bdfc' },
    { id: '22', hex: '#5484ed' }, { id: '23', hex: '#51b749' }, { id: '24', hex: '#dc2127' }
  ];

  label = { name: '', color: '#a4bdfc', googleId: '1' };

  seleccionarColor(c: any) {
    this.label.color = c.hex;
    this.label.googleId = c.id;
  }

  crearEtiqueta() {
    if (!this.label.name) return;
    this.agendaService.saveLabel({
      name: this.label.name,
      color: this.label.color,
      googleId: this.label.googleId,
      clientId: this.clientId
    }).then(() => {
      this.label.name = '';
    });
  }
}