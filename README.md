# Task Tracker API

Backend на NestJS 11, TypeScript, PostgreSQL и Prisma.

## Запуск в Docker

После установки WSL 2, перезагрузки Windows и запуска Docker Desktop откройте `C:\front\back` и выполните:

```powershell
$docker = "$env:LOCALAPPDATA\Programs\DockerDesktop\resources\bin\docker.exe"
Copy-Item .env.example .env
& $docker compose up --build
```

API: `http://localhost:3000`  
Swagger: `http://localhost:3000/docs`  
Проверка API и PostgreSQL: `http://localhost:3000/health`

Данные PostgreSQL сохраняются в volume `postgres_data`. Остановка контейнеров: `docker compose down`. Команда `docker compose down -v` также удаляет данные базы.

Служба `migrate` применяет текущую Prisma-схему через `db push`, что подходит для локальной разработки. Перед production-развёртыванием настройте версионированные Prisma migrations и задайте собственный пароль PostgreSQL в `.env`.

## API

Проекты:

- `POST /projects` — создать проект: `{ "name": "Website", "description": "Обновление сайта" }`
- `GET /projects` — список проектов с количеством задач

Задачи:

- `POST /tasks` — создать задачу с `projectId` и `title`; также поддерживаются `description`, `status`, `priority`, `dueDate`
- `GET /tasks?projectId=<uuid>` — задачи проекта
- `GET /tasks/<uuid>` — получить задачу
- `PATCH /tasks/<uuid>` — обновить задачу
- `DELETE /tasks/<uuid>` — удалить задачу

Статусы задач: `TODO`, `IN_PROGRESS`, `DONE`. Приоритеты: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.

Маршруты пока открыты без аутентификации. Перед подключением пользователей или публикацией API в сеть добавьте JWT-аутентификацию и проверку прав доступа.

## Проверки

```powershell
npm run db:generate
npm run build
npm test
npm run test:e2e
npm run lint
```
