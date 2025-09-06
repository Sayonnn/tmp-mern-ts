import { registerClient, loginClient } from "../services/auth.service.js";
import { errorResponse } from "../utils/errors.js";
import { generateAccessToken } from "../utils/jwt.js";

/** Register a new client
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} user, accessToken, refreshToken
 */
export const startClientRegistration = async (req, res) => {
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
}

/** Login a client
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} user, accessToken, refreshToken
 */
export const startClientLogin = async (req, res) => {
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
}

/** Refresh an client's access token
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} user, accessToken
 */
export const refreshClientAccessToken = async (req, res) => {
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
