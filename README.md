---

# 🚀 SPEEDMATE | Web Speed Booster & Monitoring Service

A **full MERN template** with the required dependencies for development.

📂 **GitHub Repo:** [speedmate](https://github.com/Sayonnn/speedmate.git)

---

## 🔑 Admin Notes

* The admin `permissions` column is of type **JSONB**.
* It accepts an **array of numbers** to represent permissions (e.g., `[4, 2, 1]`).
* Permission values:

  * `4 = read`
  * `2 = write`
  * `1 = access`

---

## 📧 Mail Credentials

```txt
Email: support@speedmate.com
Email: noreply@speedmate.com
Password: JudyDropship@19!
```

---

## 📧 System Default Credentials

```txt
admin: admin | speedmate19!
client: speedmate | speedmate19!
```

---

## 🛠️ Setup Steps

### After Cloning

```bash
# start docker
docker compose up --build
# create tables ( if tables doesnt exist after building )
./scripts/create_tables.sh
# fix frontend if there is an issue after docker
cd frontend && npm i && npm run dev
```

---

## 🔄 Reusing the Project

1. Update frontend env.development and env.production
2. Update database name on [ scripts/create_tables.sh ] and [ scripts/export_db.sh ] (APP_NAME | DB_ABBR)
3. Update backend env or global naming
4. Update Dockerfiles ( optional )
5. Update api.service.ts ( optional )
6. Update docker-compose.yml ( optional )
7. Update .github/workflows/main.yml ( optional )

---

### Before Committing

```bash
./scripts/export_db.sh
```

---

## 🗂️ Project Structure

```
Routes → Controllers → Services → Utils
```

---

## 📦 Database Setup

Run the following command to start PostgreSQL with Docker:

```bash
docker run --name db_speedmate \
  -e POSTGRES_USER=speedmate \
  -e POSTGRES_PASSWORD=speedmate19! \
  -e POSTGRES_DB=db_speedmate \
  -p 5432:5432 \
  -v db_speedmate_data:/var/lib/postgresql/data \
  -d postgres:16
```

---