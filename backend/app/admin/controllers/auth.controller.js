import { errorResponse } from "../../utils/response.js";
import { registerAdmin, loginAdmin } from "../services/auth.service.js";
import { generateAccessToken, verifyToken } from "../../utils/jwt.js";
import { successResponse } from "../../utils/response.js";
import { saveCookie } from "../../utils/cookies.js";

/**
 * Register a new admin
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} user, accessToken, refreshToken
 */
export const startAdminRegistration = async (req, res) => {
    try {
      const { email, password,super_admin,role, permissions, username } = req.body;
  
      if (!email || !password || !username) {
        return errorResponse(res, 400, "Email, password and username are required");
      }
        
      // Provide a default role if missing
      const finalRole = role || "admin";

      const { user, accessToken, refreshToken } = await registerAdmin(
          email,
          password,
          permissions,
          super_admin,
          username,
          finalRole
      );

  
      saveCookie(res, "refreshToken", refreshToken);
  
      return successResponse(res, "Register successful", { user, accessToken });
    } catch (err) {
      console.error("Register Error:", err);
  
      // If error has message, send it directly
      if (err instanceof Error) {
        return errorResponse(res, 400, err.message);
      }
  
      // Fallback generic error
      return errorResponse(res, 400, "Register failed, please try again");
    }
};

/**
 * Login an admin
 * @param {*} req 
 * @param {*} res 
 * @returns {Object} user, accessToken, refreshToken
 */
export const startAdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return errorResponse(res, 400, "Username and password are required");
        }

        const { user, accessToken, refreshToken } = await loginAdmin(username, password);

        saveCookie(res, "refreshToken", refreshToken);

        return successResponse(res, "Login successful", { user, accessToken });
    } catch (err) { 
        console.error("Login Error:", err);

        // Handle custom structured error
        if (err.field && err.message) {
            return errorResponse(res, 400, err.message, err.field);
        }

        // Fallback generic error
        return errorResponse(res, 400, "Login failed, please try again");
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
      const refreshToken = req.cookies.refreshToken;
  
      if (!refreshToken) {
        return errorResponse(res, 401, "Refresh token missing. Please log in again.");
      }
  
      // Verify refresh token
      const decoded = verifyToken(refreshToken);
  
      // ⚠️ At this point you can either:
      //   a) trust decoded payload (fast, stateless, typical JWT flow)
      //   b) check DB if refresh token is still valid (revocation logic)
  
      // Generate new access token
      const accessToken = generateAccessToken(decoded);
  
      return successResponse(res, "Refresh successful", {
        user: { id: decoded.id, email: decoded.email,username: decoded.username, role: decoded.role,permissions: decoded.permissions,created_at: decoded.created_at },
        accessToken,
      });
    } catch (err) {
      console.error("Refresh Token Error:", err);
  
      return errorResponse(res, 403, "Refresh failed. Please log in again.");
    }
}

/**
 * Refresh Admin Information in exchange of access token
 */
export const refreshAdminInformation = async (req, res) => {
  try {
    const accessToken = req.headers['authorization'].split(' ')[1];

    if (!accessToken) {
      return errorResponse(res, 401, "Access token missing. Please log in again.");
    }

    /** Verify access token */
    const decoded = verifyToken(accessToken);

    return successResponse(res, "Refresh successful", {
      user: { id: decoded.id, email: decoded.email,username: decoded.username, role: decoded.role,permissions: decoded.permissions,super_admin: decoded.super_admin,created_at: decoded.created_at }
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);

    return errorResponse(res, 403, "Refresh failed. Please log in again.");
  }
};