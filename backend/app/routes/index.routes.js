import express from "express";
import { config } from "../configs/index.js";
import adminAuthRoutes from "../admin/routes/auth.routes.js";
import adminMailRoutes from "../admin/routes/mail.routes.js";
import ClientAuthRoutes from "./auth.routes.js";
import ClientMailRoutes from "./mail.routes.js";
import logsRoutes from "./log.routes.js";
const router = express.Router();

/** Admin Routes */
router.use("/" + config.app.appName + "-admin/auth", adminAuthRoutes);
router.use("/" + config.app.appName + "-admin/mailer", adminMailRoutes);

/** Client Routes */
router.use("/auth", ClientAuthRoutes);
router.use("/mailer", ClientMailRoutes);

/** Monitoring Routes */
router.use("/logs", logsRoutes);

export default router;