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

1. Copy .env-copy to .env ( frontend | backend )
2. Update frontend env.development and env.production
3. Update backend .env
4. rename project sayonph -> desired project name
5. Update Dockerfiles ( optional )
6. Update docker-compose.yml ( optional )
7. Update .github/workflows/main.yml ( optional )
8. provide own logo

---

## 📝 Before final commit

1. git rm -r --cached backend/.env
2. git rm -r --cached frontend/.env
3. git rm -r --cached backend/node_modules
4. git rm -r --cached frontend/node_modules
5. cp .env .env-copy ( frontend | backend )