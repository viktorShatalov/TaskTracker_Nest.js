# AGENTS.md

## Контекст проекта

Этот репозиторий — backend на NestJS 11 для трекера задач на TypeScript с PostgreSQL через Prisma. Приложение организовано по модульной структуре и запускается локально в Docker Compose. Изменения схемы Prisma применяются через переменную окружения DATABASE_URL.

## Соглашения по работе

- Держи приложение модульным: функциональный код должен находиться в `src/<feature>/` с контроллером, сервисом и модулем.
- Предпочитай внедрение зависимостей NestJS вместо глобального состояния и разрозненных обращений к базе напрямую.
- Используй Prisma через `PrismaService` и бизнес-логику в сервисах; не размазывай прямые вызовы Prisma-клиента по контроллерам.
- DTO лежат в `src/<feature>/dto/` и должны соответствовать паттернам валидации NestJS с использованием `class-validator` и `class-transformer`.
- Сохраняй существующие имена: `ProjectsModule`, `TasksModule`, `ProjectsController`, `TasksService` и т. п.
- Поддерживай явные и небольшие HTTP-роуты и бизнес-логику: проект пока без аутентификации и без RBAC.

## Карта архитектуры

- Корневой модуль приложения: `src/app.module.ts`
- Настройка Prisma: `src/prisma/prisma.module.ts`, `src/prisma/prisma.service.ts`
- API проектов: `src/projects/`
- API задач: `src/tasks/`
- Схема Prisma: `prisma/schema.prisma`
- Docker-конфигурация: `docker-compose.yml`, `Dockerfile`

## Локальная разработка

```bash
npm install
Copy-Item .env.example .env   # или создай аналогичный .env файл
# из корня проекта
# при наличии Docker Desktop / WSL 2
& "$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin\docker.exe" compose up --build
```

Полезные команды проверки:

```bash
npm run db:generate
npm run build
npm test
npm run test:e2e
npm run lint
```

## Правила для Prisma и базы данных

- Модели Prisma находятся в `prisma/schema.prisma`.
- При изменении моделей или enum обновляй схему и запускай `npm run db:generate`.
- Для локальной разработки `docker-compose.yml` запускает сервис `migrate` с `prisma db push` для быстрой синхронизации схемы.
- Не меняй схему БД вне Prisma-схемы, если задача явно не требует миграционного workflow.

## Тестирование и валидация

- Для unit- и e2e-тестов используется Vitest.
- При изменении поведения контроллеров или сервисов добавляй или обновляй тесты.
- Запускай минимально релевантную проверку до и после изменения: обычно это `npm test` и `npm run lint`.

## Рекомендации для AI-агентов

- Держи изменения узкими и соответствующими текущему стилю NestJS.
- При добавлении нового функционала следуй уже существующему паттерну модулей, как в `projects` и `tasks`.
- Если затрагиваются API-контракты, обновляй одновременно сервисную логику, DTO и валидационные предположения.
- Если задача неоднозначна, предпочитай минимальные, не ломающие изменения, которые соответствуют текущей структуре проекта, а не вводят новую архитектуру.

## Документация

- [README.md](README.md)
- [prisma/schema.prisma](prisma/schema.prisma)
- [src/app.module.ts](src/app.module.ts)
