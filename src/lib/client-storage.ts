import { User } from '@/types';

const CLIENTS_KEY = 'crm_clients_v1';
const CLIENT_PASSWORDS_KEY = 'crm_client_passwords_v1';

export type ClientPasswordMap = Record<string, string>; // key = email en lowercase

export function loadStoredClients(): User[] {
    try {
        const raw = localStorage.getItem(CLIENTS_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed;
    } catch {
        return [];
    }
}

export function saveStoredClients(clients: User[]) {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function loadClientPasswords(): ClientPasswordMap {
    try {
        const raw = localStorage.getItem(CLIENT_PASSWORDS_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
        return {};
    }
}

export function saveClientPasswords(map: ClientPasswordMap) {
    localStorage.setItem(CLIENT_PASSWORDS_KEY, JSON.stringify(map));
}
