export interface Contacto {
    id?: string;
    nombreCompleto: string;
    celular: string;
    email: string;
    cargo?: string;
    grupoId: string; // ID del Grupo/Etiqueta
    clientId: string;
}