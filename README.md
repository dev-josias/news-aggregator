# News Aggregator Challenge

This project is a **FullStack news aggregator** built with:

- **Backend**: Laravel + PostgreSQL + Redis
- **Frontend**: React.js + TypeScript
- **Dockerized** with `docker-compose`

---

## 🚀 Setup & Run

### 1. Clone the repository

```bash
git clone git@github.com:dev-josias/news-aggregator.git
cd news-aggregator
```

### 2. Start the stack

```bash
docker compose up --build
```

### 3. Access the apps

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:9000
- **Postgres**: localhost:5432
- **Redis**: localhost:6379

---

## 📰 Features

- User registration & login
- News ingestion from **NewsAPI, The Guardian, and New York Times**
- Local filtering (date, source, category, keyword)
- Personalized news feed
- Responsive UI

---

## ⚙️ Notes

- Scheduled ingestion runs automatically via the **scheduler** service (every hour).
- Queue workers are handled by the **queue** service.
- All articles are stored locally in PostgreSQL.

---

## 📜 License

MIT
