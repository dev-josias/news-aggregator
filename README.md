# 📰 News Aggregator Challenge

This project is a **FullStack News Aggregator** built with:

- **Backend**: Laravel 12 + PostgreSQL + Redis
- **Frontend**: React.js + TypeScript (Vite)
- **Dockerized** with `docker-compose`

---

## 🚀 Setup & Run

### 1. Clone the repository

```bash
git clone git@github.com:dev-josias/news-aggregator.git
cd news-aggregator
```

### 2. Environment setup

Copy the example environment file:

```bash
cp backend/.env.example backend/.env
```

👉 The `.env.example` already includes working defaults for Postgres, Redis, and API service URLs.  
You only need to provide valid **API keys** for **NewsAPI**, **The Guardian**, and **NYT** if you want real news ingestion.

### 3. Start the stack

```bash
docker compose build api
docker compose up --build
```

### 4. Run migrations & seeders

```bash
docker compose exec api php artisan migrate
```

### 5. Access the apps

- **Frontend** → [http://localhost:5173](http://localhost:5173)
- **Backend API** → [http://localhost:9000](http://localhost:9000)
- **Postgres** → `localhost:5432` (user: `news`, password: `news`)
- **Redis** → `localhost:6379`

---

## 📰 Features

- ✅ User registration & login
- ✅ Personalized preferences (sources, categories, authors)
- ✅ News ingestion from **NewsAPI, The Guardian, and NYT**
- ✅ Article search & filtering (keyword, date, source, category)
- ✅ Automatic ingestion via scheduler (hourly)
- ✅ Queue workers for ingestion jobs
- ✅ Mobile-responsive frontend

---

## ⚙️ Notes for Testers

- Ingestion runs **automatically** via the `scheduler` service (every hour).
- You can also trigger ingestion manually:

```bash
docker compose exec api php artisan news:fetch-all --since="-6 hours"
```

- Queue jobs are handled by the `queue` service.
- All articles are stored locally in PostgreSQL and exposed through `/api/v1/articles`.

---

## 📜 License

MIT
