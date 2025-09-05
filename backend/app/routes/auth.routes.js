import express from "express";
import { registerClient, loginClient } from "../services/auth.service.js";
import { errorResponse } from "../utils/errors.js";
import { generateAccessToken } from "../utils/jwt.js";

const router = express.Router();

/** REGISTER (client only) */
router.post("/register", async (req, res) => {
  try {
    const { email, password,username } = req.body;

    if (!email || !password || !username) {
      return errorResponse(res, 400, "Email, password and username are required");
    }

    const { user, accessToken, refreshToken } = await registerClient(email, password, username);

    return res.json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error("Register Error:", err);
    return errorResponse(res, 400, err.message || "Register failed");
  }
});

/** LOGIN (client only) */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Email, password are required");
    }

    const { user, accessToken, refreshToken } = await loginClient(email, password);

    return res.json({ user, accessToken, refreshToken });
  } catch (err) {
    console.error("Login Error:", err);
    return errorResponse(res, 400, err.message || "Login failed");
  }
});

/** Refresh Token (client only) */
router.post("/refresh-access-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return errorResponse(res, 400, "Refresh token is required");
    }

    const { user, accessToken } = await generateAccessToken(refreshToken);

    return res.json({ user, accessToken });
  } catch (err) {
    console.error("Refresh Token Error:", err);
    return errorResponse(res, 400, err.message || "Refresh token failed");
  }
});

export default router;
