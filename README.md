# 🚀 SPEEDMATE | Web Speed Booster & Monitoring Service

A **full MERN template** with the required dependencies for development.
⚡ Make sure to run `npm install` inside both `frontend` and `backend` folders.

📂 **GitHub Repo:** [speedmate](https://github.com/Sayonnn/speedmate.git)

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

## 🔑 Admin Notes

* The `spm_admins.permissions` column accepts **JSON (bjson)**.
* Permissions use a **binary system**:

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
# create tables
./scripts/create_tables.sh
# fix frontend if there is an issue after docker
cd frontend && npm i && npm run dev
```

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

## 🔄 Reusing the Project

1. Update frontend env or global namings
2. Update frontend index.html
3. Update database name on [ scripts/create_tables.sh ] and [ scripts/export_db.sh ] (APP_NAME | DB_ABBR)
4. Update backend env or global naming
5. Update docker-compose.yml
6. Update .github/workflows/main.yml
7. Update .env
8. Update .gitignore
9. Update Dockerfile
---
