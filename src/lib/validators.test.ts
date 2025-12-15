/**
 * Tests unitarios para validadores Zod
 * 
 * Ejecutar:
 * npm test -- src/lib/validators.test.ts
 */

import { loginSchema, clientSchema, productSchema, saleSchema } from '@/lib/validators';

describe('Validators', () => {
  // ============ LOGIN SCHEMA TESTS ============

  describe('loginSchema', () => {
    test('debería validar email y contraseña correctos', () => {
      const validData = {
        email: 'admin@crm.com',
        password: 'admin123',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('debería rechazar email inválido', () => {
      const invalidData = {
        email: 'notanemail',
        password: 'admin123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería rechazar contraseña corta', () => {
      const invalidData = {
        email: 'admin@crm.com',
        password: '123',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  // ============ CLIENT SCHEMA TESTS ============

  describe('clientSchema', () => {
    test('debería validar cliente correcto', () => {
      const validData = {
        name: 'Juan Pérez',
        email: 'juan@empresa.com',
        phone: '+52 555 123 4567',
        company: 'Mi Empresa',
        status: 'active' as const,
        password: 'securepass123',
      };

      const result = clientSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('debería rechazar nombre corto', () => {
      const invalidData = {
        name: 'Jo', // muy corto
        email: 'juan@empresa.com',
        status: 'active' as const,
        password: 'securepass123',
      };

      const result = clientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería rechazar email inválido', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'not-a-valid-email',
        status: 'active' as const,
        password: 'securepass123',
      };

      const result = clientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería rechazar teléfono inválido', () => {
      const invalidData = {
        name: 'Juan Pérez',
        email: 'juan@empresa.com',
        phone: '123', // muy corto
        status: 'active' as const,
        password: 'securepass123',
      };

      const result = clientSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería aceptar sin teléfono', () => {
      const validData = {
        name: 'Juan Pérez',
        email: 'juan@empresa.com',
        phone: undefined,
        status: 'active' as const,
        password: 'securepass123',
      };

      const result = clientSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============ PRODUCT SCHEMA TESTS ============

  describe('productSchema', () => {
    test('debería validar producto correcto', () => {
      const validData = {
        name: 'Laptop Pro X500',
        description: 'Una laptop de alto rendimiento para profesionales',
        price: 25999.99,
        stock: 15,
        image_url: 'https://example.com/image.jpg',
      };

      const result = productSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('debería rechazar nombre corto', () => {
      const invalidData = {
        name: 'La',
        description: 'Una laptop de alto rendimiento para profesionales',
        price: 25999.99,
        stock: 15,
      };

      const result = productSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería rechazar descripción corta', () => {
      const invalidData = {
        name: 'Laptop Pro X500',
        description: 'Corta',
        price: 25999.99,
        stock: 15,
      };

      const result = productSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería rechazar precio negativo', () => {
      const invalidData = {
        name: 'Laptop Pro X500',
        description: 'Una laptop de alto rendimiento para profesionales',
        price: -100,
        stock: 15,
      };

      const result = productSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería rechazar stock decimal', () => {
      const invalidData = {
        name: 'Laptop Pro X500',
        description: 'Una laptop de alto rendimiento para profesionales',
        price: 25999.99,
        stock: 15.5,
      };

      const result = productSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería aceptar URL vacía (opcional)', () => {
      const validData = {
        name: 'Laptop Pro X500',
        description: 'Una laptop de alto rendimiento para profesionales',
        price: 25999.99,
        stock: 15,
        image_url: '',
      };

      const result = productSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  // ============ SALE SCHEMA TESTS ============

  describe('saleSchema', () => {
    test('debería validar venta correcta', () => {
      const validData = {
        product_id: 'prod-123',
        quantity: 5,
      };

      const result = saleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    test('debería rechazar sin product_id', () => {
      const invalidData = {
        product_id: '',
        quantity: 5,
      };

      const result = saleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería rechazar cantidad cero', () => {
      const invalidData = {
        product_id: 'prod-123',
        quantity: 0,
      };

      const result = saleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    test('debería rechazar cantidad decimal', () => {
      const invalidData = {
        product_id: 'prod-123',
        quantity: 5.5,
      };

      const result = saleSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
