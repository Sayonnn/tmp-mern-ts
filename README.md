# upguard
Full template of MERN with the needed dependencies for development. *** run npm install on frontend and backend folders ***

## database credentials
```
docker run --name db_upguard \
  -e POSTGRES_USER=upguard \
  -e POSTGRES_PASSWORD=upguard19! \
  -e POSTGRES_DB=db_upguard \
  -p 5432:5432 \
  -v db_upguard_data:/var/lib/postgresql/data \
  -d postgres:16
``` 