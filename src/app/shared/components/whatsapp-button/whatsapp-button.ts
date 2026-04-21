import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  imports: [CommonModule],
  templateUrl: './whatsapp-button.html',
  styleUrls: ['./whatsapp-button.css']
})
export class WhatsappButton {
  @Input() phoneNumber: string = '';
  @Input() visible: boolean = false;

  openWhatsapp() {
    const url = `https://wa.me/${this.phoneNumber}?text=Deseo solicitar una cita`;
    window.open(url, '_blank');
  }
}