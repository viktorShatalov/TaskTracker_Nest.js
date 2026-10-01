import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Создаёт конфигурацию Vitest для unit-тестов.
export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  // Подключает разрешение путей из tsconfig.json.
  plugins: [tsconfigPaths()],
  // Настраивает параметры поиска и запуска тестов.
  test: {
    // Доступ к expect и другим API Vitest без явного импорта.
    globals: true,
    // Задаёт корень поиска тестов как корень проекта.
    root: './',
    // Включает файлы unit-тестов с суффиксом .spec.ts.
    include: ['**/*.spec.ts'],
  },
});
