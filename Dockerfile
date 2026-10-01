# Стадия сборки приложения на Node.js 22 Alpine.
FROM node:22-alpine AS build
# Рабочая папка внутри builder-контейнера.
WORKDIR /app
# Устанавливает OpenSSL, нужный движку Prisma.
RUN apk add --no-cache openssl
# Копирует npm-манифесты для установки зависимостей.
COPY package*.json ./
# Копирует Prisma schema перед генерацией клиента.
COPY prisma ./prisma
# Устанавливает зафиксированные в lock-файле пакеты.
RUN npm ci
# Копирует исходный код и конфигурацию проекта.
COPY . .
# Генерирует Prisma Client и собирает приложение NestJS.
RUN npm run db:generate && npm run build

# Стадия компактного production-образа.
FROM node:22-alpine AS production
# Рабочая папка внутри production-контейнера.
WORKDIR /app
# Включает production-режим Node.js.
ENV NODE_ENV=production
# Устанавливает библиотеку, требуемую Prisma Engine.
RUN apk add --no-cache openssl
# Копирует npm-манифесты runtime-приложения.
COPY package*.json ./
# Устанавливает только production-зависимости без install-скриптов.
RUN npm ci --omit=dev --ignore-scripts
# Копирует собранный NestJS код с непривилегированным владельцем.
COPY --from=build --chown=node:node /app/dist ./dist
# Копирует сгенерированный под Linux Alpine Prisma Client.
COPY --from=build --chown=node:node /app/node_modules/.prisma ./node_modules/.prisma
# Запускает приложение от непривилегированного пользователя.
USER node
# Документирует порт HTTP API контейнера.
EXPOSE 3000
# Запускает скомпилированную точку входа.
CMD ["node", "dist/main.js"]