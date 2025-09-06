import pkg from "pg";
import { config } from "./index.js";

const { Pool } = pkg;

export const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
});
  