import { errorResponse } from "../../utils/errors.js";
import { registerAdmin, loginAdmin } from "../services/auth.service.js";
import { generateAccessToken } from "../../utils/jwt.js";

/**
 * Register a new admin
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} user, accessToken, refreshToken
 */
export const startAdminRegistration = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return errorResponse(res, 400, "Email, password and username are required");
        }

        const { user, accessToken, refreshToken } = await registerAdmin(email, password, username);

        return res.json({ user, accessToken, refreshToken });
    } catch (err) {
        console.error("Register Error:", err);
        return errorResponse(res, 400, err.message || "Register failed");
    }
}

/**
 * Login an admin
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} user, accessToken, refreshToken
 */
export const startAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return errorResponse(res, 400, "Email and password are required");
        }

        const { user, accessToken, refreshToken } = await loginAdmin(email, password);

        return res.json({ user, accessToken, refreshToken });
    } catch (err) { 
        console.error("Login Error:", err);
        return errorResponse(res, 400, err.message || "Login failed");
    }
}

/**
 * Refresh an admin's access token
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} user, accessToken
 */
export const refreshAdminAccessToken = async (req, res) => {
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
}