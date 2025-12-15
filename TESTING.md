# 📋 CONFIGURACIÓN DE TESTS

## Instalación de dependencias de testing

```bash
npm install --save-dev jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

## Crear configuración de Jest

Crea un archivo `jest.config.ts` en la raíz del proyecto:

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};

export default config;
```

## Crear setupTests.ts

Crea `src/setupTests.ts`:

```typescript
import '@testing-library/jest-dom';

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

global.localStorage = localStorageMock as any;
```

## Actualizar package.json

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## Ejecutar tests

```bash
# Ejecutar todos los tests una sola vez
npm test

# Modo watch (re-ejecuta al cambiar archivos)
npm run test:watch

# Con cobertura
npm run test:coverage
```

## Archivos de test incluidos

- `src/contexts/AuthContext.test.tsx` - Tests de autenticación
- `src/lib/validators.test.ts` - Tests de validadores Zod

## Mejores prácticas

1. **Tests unitarios**: Una función = Un test
2. **AAA Pattern** (Arrange, Act, Assert):
   ```typescript
   test('debería hacer algo', () => {
     // Arrange: preparar datos
     const data = { email: 'test@test.com' };
     
     // Act: ejecutar la función
     const result = validateEmail(data);
     
     // Assert: verificar resultado
     expect(result).toBe(true);
   });
   ```

3. **Naming**: Usa nombres descriptivos para tests
4. **Cobertura**: Intenta mantener >80% de cobertura

## Próximas mejoras para testing

- [ ] Tests de componentes React con React Testing Library
- [ ] Tests de integración (E2E con Playwright)
- [ ] Tests de snapshot para componentes UI
- [ ] CI/CD pipeline (GitHub Actions)

---

**Nota**: Los tests son templates básicos. Expande según tus necesidades.
