// src/lib/product-storage.ts
import { Product } from '@/types';

const PRODUCTS_KEY = 'crm_products_by_user';

type ProductMap = Record<string, Product[]>;

/**
 * Carga el mapa completo de productos (userId -> productos)
 */
function loadProductsMap(): ProductMap {
    if (typeof window === 'undefined') return {};
    try {
        const raw = window.localStorage.getItem(PRODUCTS_KEY);
        if (!raw) return {};
        return JSON.parse(raw) as ProductMap;
    } catch {
        return {};
    }
}

/**
 * Guarda el mapa completo de productos en localStorage
 * @param map - Mapa de userId a array de productos
 */
function saveProductsMap(map: ProductMap) {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(map));
}

/**
 * Carga los productos de un usuario específico
 * @param userId - ID del usuario propietario de los productos
 * @returns Array de productos del usuario o array vacío
 */
export function loadStoredProducts(userId: string): Product[] {
    const map = loadProductsMap();
    return map[userId] ?? [];
}

/**
 * Guarda los productos de un usuario específico
 * @param userId - ID del usuario propietario de los productos
 * @param products - Array de productos a guardar
 */
export function saveStoredProducts(userId: string, products: Product[]) {
    const map = loadProductsMap();
    map[userId] = products;
    saveProductsMap(map);
}
