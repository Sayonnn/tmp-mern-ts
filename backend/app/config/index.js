import dotenv from "dotenv";
dotenv.config();


export const config = {
    port: process.env.PORT || 5000, 
    db:{
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    },
    jwt:{
        secret: process.env.JWT_SECRET,
        access_token_expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
        refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        algorithm: process.env.JWT_ALGORITHM
    },
    redis:{}
}