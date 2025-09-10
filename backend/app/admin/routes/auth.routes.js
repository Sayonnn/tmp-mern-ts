import express from 'express'
import { startAdminRegistration, startAdminLogin, refreshAdminAccessToken, refreshAdminInformation } from "../controllers/auth.controller.js";

const router = express.Router();

/** REGISTER (admin only) */
router.post("/register", startAdminRegistration);

/** LOGIN (admin only) */
router.post("/login", startAdminLogin);

/** Refresh Token (admin only) */
router.post("/refresh-access-token", refreshAdminAccessToken);

/** Refresh Admin Information (admin only) */
router.post("/refresh-admin-information", refreshAdminInformation);

export default router;