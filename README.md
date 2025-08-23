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
cp frontend/.env.example frontend/.env
```

The `.env.example` already includes working defaults for Postgres, Redis, and API service URLs.  
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

- [x] User registration & login
- [x] Personalized preferences (sources, categories, authors)
- [x] News ingestion from **NewsAPI, The Guardian, and NYT**
- [x] Article search & filtering (keyword, date, source, category)
- [x] Automatic ingestion via scheduler (hourly)
- [x] Queue workers for ingestion jobs
- [x] Mobile-responsive frontend

---

## ⚙️ Notes for Testers

- Ingestion runs **automatically** via the `scheduler` service (every minute locally).
- You can also trigger ingestion manually:

```bash
docker compose exec api php artisan news:fetch-all --since="-6 hours"
```

- Then reload the frontend and the ingested data should display

- Queue jobs are handled by the `queue` service.
- All articles are stored locally in PostgreSQL and exposed through `/api/v1/articles`.

---

## ⚠️ Gotchas / Known Issues

- **Vendor folder & autocompletion**

  - The backend `vendor/` folder is built inside the Docker container.
  - If you need local IDE autocompletion (in VSCode), run:
    ```bash
    docker compose exec api composer install
    ```
    This will populate `backend/vendor` locally.

- **Scheduler & Queue startup**

  - The `scheduler` and `queue` services wait until migrations are applied.
  - If you stop/start only the API, they may still show `waiting for migrations...`.  
    Restart them with:
    ```bash
    docker compose restart scheduler queue
    ```

- **NewsAPI free plan limits**

  - Free API keys may return **0 results** or errors like `maximumResultsReached`.

- **First run latency**

  - On the first launch, ingestion may take a few minutes depending on network/API responses.
  - Check logs with:
    ```bash
    docker compose logs -f scheduler
    ```

- **Frontend filters crash**

  - If taxonomies (sources, categories, authors) are empty, some filters may throw errors.
  - Run ingestion once:
    ```bash
    docker compose exec api php artisan news:fetch-all --since="-24 hours"
    ```
    Then reload the frontend.

- **Ports already in use**
  - Ensure no local Postgres/Redis/Nginx conflicts:
    - Postgres → `5432`
    - Redis → `6379`
    - Backend → `9000`
    - Frontend → `5173`

## 📜 License

MIT
