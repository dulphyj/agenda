// src/app/core/models/usuario.ts
export interface Usuario {
    uid: string;
    email: string;
    role: 'super-admin' | 'asistente' | 'viceministro';
    clientId?: string;
    displayName?: string;    // Agregado para el formulario
    whatsappNumber?: string; // Agregado para el formulario
    isActiveWA?: boolean;    // Para saber de quién es el WhatsApp que se ve
}