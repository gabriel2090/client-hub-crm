// src/lib/sales-storage.ts
import { Sale } from '@/types';

const SALES_KEY = 'crm_sales_by_user_v1';

type SalesMap = Record<string, Sale[]>;

/**
 * Carga el mapa completo de ventas (userId -> ventas[])
 */
function loadSalesMap(): SalesMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(SALES_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as SalesMap;
  } catch (error) {
    console.error('[sales-storage] Error loading stored sales:', error);
    return {};
  }
}

/**
 * Guarda el mapa completo de ventas en localStorage
 */
function saveSalesMap(map: SalesMap) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SALES_KEY, JSON.stringify(map));
  } catch (error) {
    console.error('[sales-storage] Error saving sales map:', error);
  }
}

/**
 * Obtiene las ventas almacenadas para un usuario
 */
export function loadStoredSales(userId: string): Sale[] {
  const map = loadSalesMap();
  return map[userId] ?? [];
}

/**
 * Guarda las ventas para un usuario específico
 */
export function saveStoredSales(userId: string, sales: Sale[]) {
  const map = loadSalesMap();
  map[userId] = sales;
  saveSalesMap(map);
}
