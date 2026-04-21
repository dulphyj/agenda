// src/app/core/models/cita.ts
export interface Cita {
    id?: string;
    title: string;
    contactId: string;
    contactName: string;
    date: any;
    labelId: string;
    clientId: string;
    // NUEVOS CAMPOS
    motivo: string;
    duracion: number; // en minutos
    ubicacion: string;
    contactPhone?: string;
    contactEmail?: string;
}