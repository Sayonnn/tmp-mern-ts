import express from "express";
import { startClientRegistration, startClientLogin, refreshClientAccessToken } from "../controllers/auth.controller.js";

const router = express.Router();

/** REGISTER (client only) */
router.post("/register", startClientRegistration);

/** LOGIN (client only) */
router.post("/login", startClientLogin);

/** Refresh Token (client only) */
router.post("/refresh-access-token", refreshClientAccessToken);

export default router;
