import { z } from 'zod';
import { loadStoredClients, loadClientPasswords } from './client-storage';

/**
 * Schema de validación para login
 */
export const loginSchema = z.object({
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Schema de validación para creación/edición de clientes
 * Incluye validación de email único
 */
export const clientSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string()
    .email('Email inválido')
    .toLowerCase()
    .refine(
      (email) => {
        // Obtener todos los clientes almacenados
        const storedClients = loadStoredClients();
        const clientPasswordMap = loadClientPasswords();
        const existingEmails = Object.keys(clientPasswordMap);
        return !existingEmails.includes(email);
      },
      { message: 'Este email ya está registrado' }
    ),
  phone: z.string()
    .optional()
    .refine((val) => !val || /^\+?[0-9\s\-()]{10,}$/.test(val), {
      message: 'Teléfono inválido',
    }),
  company: z.string()
    .optional(),
  status: z.enum(['active', 'inactive']),
  password: z.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional(),
});

export type ClientFormData = z.infer<typeof clientSchema>;

/**
 * Schema para actualizar cliente (sin validar email duplicado si es el mismo)
 */
export const clientUpdateSchema = clientSchema.omit({ password: true }).extend({
  email: z.string()
    .email('Email inválido')
    .toLowerCase(),
});

export type ClientUpdateFormData = z.infer<typeof clientUpdateSchema>;

/**
 * Schema de validación para productos
 */
export const productSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(150, 'El nombre no puede exceder 150 caracteres'),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  price: z.number()
    .positive('El precio debe ser mayor a 0'),
  stock: z.number()
    .int('El stock debe ser un número entero')
    .nonnegative('El stock no puede ser negativo'),
  image_url: z.string()
    .url('URL de imagen inválida')
    .optional()
    .or(z.literal('')),
});

export type ProductFormData = z.infer<typeof productSchema>;

/**
 * Schema para registrar ventas
 */
export const saleSchema = z.object({
  product_id: z.string()
    .min(1, 'Selecciona un producto'),
  quantity: z.number()
    .int('La cantidad debe ser un número entero')
    .positive('La cantidad debe ser mayor a 0'),
});

export type SaleFormData = z.infer<typeof saleSchema>;
