export interface Client {
    id?: string;
    name: string;
    whatsappNumber: string;
    showWhatsapp: boolean;
    theme: 'light' | 'dark';
}