---

# Sayon PH 🇵🇭 | Professional web portfolio

MERN template ( with auth ) + TS + Docker | use if you want built in auth with mongodb

📂 **GitHub Repo:** [sayonph](https://github.com/Sayonnn/sayonph.git)

---

## 🛠️ Setup Steps

### After Cloning

```bash
docker compose up --build
# try if there is an issue after docker
cd frontend && npm i 
cd backend && npm i
```

---

## 🔄 Reusing the Project

1. Update frontend env.development and env.production
2. Update backend .env
3. rename project sayonph -> desired project name
4. Update Dockerfiles ( optional )
5. Update docker-compose.yml ( optional )
6. Update .github/workflows/main.yml ( optional )

---

---
## Before final commit

1. git rm -r --cached backend/.env
2. git rm -r --cached frontend/.env
3. git rm -r --cached backend/node_modules
4. git rm -r --cached frontend/node_modules
5. cp .env .env-copy ( frontend | backend )