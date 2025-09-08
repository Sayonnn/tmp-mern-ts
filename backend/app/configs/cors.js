const allowedOrigins = ["http://localhost:8001","http://localhost:5173"];

export const corsConfig = {
    origin: (origin,callback) => {
        if(!origin || allowedOrigins.includes(origin)){
            callback(null,origin);
        }else{
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,              
}