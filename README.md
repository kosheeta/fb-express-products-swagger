# fb-express-products-swagger — учебный проект Express + React + Swagger (CRUD без БД)

Этот репозиторий — учебный проект к дисциплине **«Фронтенд и бэкенд разработка»** (4 семестр).
Он показывает полный цикл работы с API на Express **без базы данных**: данные хранятся в JSON-файле, а контракт API фиксируется через **Swagger/OpenAPI**.

## Что внутри (идея проекта)

- **Backend**: Express API `http://localhost:3000`
- **Frontend**: React (Vite) `http://localhost:3001`
- **CRUD для товаров**: `/api/products`
- **Хранилище**: `backend/data/products.json` (рабочий файл) + `backend/data/products.seed.json` (эталон/seed)
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI YAML**: `http://localhost:3000/openapi.yaml`

## Структура проекта (минимальная и расширяемая)

- `backend/app.js` — точка сборки: middleware, роутеры, обработчики ошибок/404, запуск сервера
- `backend/routes/` — HTTP-слой (маршруты и статусы ответов)
- `backend/store/` — слой данных (чтение/запись JSON + защита от гонок записи через очередь)
- `backend/data/` — файлы данных (`products.json` и `products.seed.json`)
- `backend/middleware/` — поперечная логика (например, логирование запросов)
- `backend/docs/openapi.yaml` — OpenAPI-спецификация (контракт API)
- `frontend/src/api/` — клиентские обёртки над HTTP (axios + функции для CRUD)
- `backend/api.http` — набор тестовых запросов для VS Code (REST Client)

## Быстрый старт

### 1) Backend

```bash
cd backend
npm i
npm run dev

Сервер: http://localhost:3000

Мини-проверка:
	•	GET http://localhost:3000/ → строка Express API is running. Try /api/products
	•	GET http://localhost:3000/api/products → массив товаров

Swagger:
	•	GET http://localhost:3000/api-docs → Swagger UI
	•	GET http://localhost:3000/openapi.yaml → OpenAPI YAML

2) Frontend (React)

cd frontend
npm i
npm run dev

UI: http://localhost:3001

Важно: фронт обращается к API на http://localhost:3000 (см. frontend/src/api/apiClient.js).

API: маршруты и поведение (как есть в коде)

Базовый префикс подключается в backend/app.js:
	•	app.use("/api/products", productsRouter)

CRUD
	•	GET  http://localhost:3000/api/products — список товаров
	•	POST http://localhost:3000/api/products — создать товар
	•	PATCH http://localhost:3000/api/products/:id — частично обновить
	•	DELETE http://localhost:3000/api/products/:id — удалить

Валидация и формат ошибок (важно для лекции)

Формат ошибок в ответах использует поле error:

400 Bad Request
	•	POST /api/products
	•	если title не строка или пустой после trim() → 400 + { "error": "title is required" }
	•	price приводится как Number(price) || 0 (строгой валидации > 0 нет)

404 Not Found — два смысла
	1.	404 “ресурс не найден” внутри существующего маршрута

	•	PATCH /api/products/:id → если id не найден → 404 + { "error": "Not found" }
	•	DELETE /api/products/:id → если id не найден → 404 + { "error": "Not found" }

	2.	404 “маршрут не найден вообще” (fallback в app.js)

	•	любой неизвестный путь → 404 + { "error": "Not found" }

500 Internal Server Error
	•	централизованно в backend/app.js
	•	ответ: 500 + { "error": "Internal Server Error" }
	•	причина пишется в лог (через console.error(err))

Данные: JSON вместо БД

Данные живут на диске:
	•	рабочий файл: backend/data/products.json
	•	seed/эталон: backend/data/products.seed.json

Смысл seed:
	•	проект стартует “с данными” без ручной подготовки
	•	если products.json отсутствует, он создаётся из products.seed.json

Защита от гонок записи:
	•	в backend/store/productsStore.js используется очередь записи, чтобы параллельные POST/PATCH/DELETE не ломали JSON.

Swagger/OpenAPI: контракт API

Swagger — это не просто “документация”, а договор между:
	•	backend (как реально отвечает сервер),
	•	frontend (что он ожидает),
	•	тестами (что проверяем),
	•	преподавателем/студентом (что считается правильным).

Если сервер и openapi.yaml расходятся — это технический долг и источник багов интеграции.

Проверка запросов
	1.	backend/api.http (VS Code + REST Client) — быстрые воспроизводимые запросы
	2.	Swagger UI: http://localhost:3000/api-docs — “Try it out”
	3.	(опционально) Postman — если привычнее

Где смотреть “источник правды”
	•	Реальное поведение API: backend/routes/products.js и backend/app.js
	•	Контракт: backend/docs/openapi.yaml
	•	Тестовый набор: backend/api.http

---

```
