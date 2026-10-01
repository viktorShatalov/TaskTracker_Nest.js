import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

// Создаёт конфигурацию Vitest для end-to-end тестов.
export default defineConfig({
  // Подключает разрешение путей из tsconfig.json.
  plugins: [tsconfigPaths()],
  // Настраивает параметры поиска и запуска тестов.
  test: {
    // Доступ к expect и другим API Vitest без явного импорта.
    globals: true,
    // Задаёт корень поиска тестов как корень проекта.
    root: './',
    // Включает только end-to-end тесты с суффиксом .e2e-spec.ts.
    include: ['**/*.e2e-spec.ts'],
  },
});
