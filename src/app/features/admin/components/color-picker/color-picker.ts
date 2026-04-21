import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendaService } from '../../../../core/services/agenda';

@Component({
  selector: 'app-color-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './color-picker.html'
})
export class ColorPicker {
  @Input() clientId: string = '';
  private agendaService = inject(AgendaService);

  label = { name: '', color: '#0d6efd' };

  crearEtiqueta() {
    if (!this.label.name) return;
    this.agendaService.saveLabel({ ...this.label, clientId: this.clientId }).then(() => {
      this.label.name = '';
    });
  }
}