import { registerClient, loginClient } from "../services/auth.service.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { generateAccessToken, verifyToken } from "../utils/jwt.js";
import { saveCookie } from "../utils/cookies.js";

/** Register a new client
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} user, accessToken, refreshToken
 */
export const startClientRegistration = async (req, res) => {
    try {
        const { email, password, username } = req.body;
    
        if (!email || !password || !username) {
          return errorResponse(res, 400, "Email, password and username are required");
        }
    
        const { user, accessToken, refreshToken } = await registerClient(email, password, username);

        saveCookie(res, "refreshToken", refreshToken);
    
        return successResponse(res, "Register successful", { user, accessToken });
    } catch (err) {
        console.error("Register Error:", err);

        // Handle custom structured error
        if (err.field && err.message) {
            return errorResponse(res, 400, err.message, err.field);
        }

        // Fallback generic error
        return errorResponse(res, 400, "Register failed, please try again");
    }
}
 
/** Login a client
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Object} user, accessToken, refreshToken
 */
export const startClientLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(res, 400, "Username and password are required", !username ? "username" : "password");
    }

    const { user, accessToken, refreshToken } = await loginClient(username, password);

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
};

/**
 * Refresh client's access token using refresh token
 */
export const refreshClientAccessToken = async (req, res) => {
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
      user: { id: decoded.id, email: decoded.email,username: decoded.username, role: decoded.role,created_at: decoded.created_at },
      accessToken,
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);

    return errorResponse(res, 403, "Refresh failed. Please log in again.");
  } 
};

/**
 * Refresh Client Information in exchange of access token
 */
export const refreshClientInformation = async (req, res) => {
  try {
    const accessToken = req.headers['authorization'].split(' ')[1];


    if (!accessToken) {
      return errorResponse(res, 401, "Access token missing. Please log in again.");
    }
    
    /** Verify access token */
    const decoded = verifyToken(accessToken);
    
    return successResponse(res, "Refresh successful", {
      user: { id: decoded.id, email: decoded.email,username: decoded.username, role: decoded.role,created_at: decoded.created_at }
    });
  } catch (err) {
    console.error("Refresh Token Error:", err);

    return errorResponse(res, 403, "Refresh failed. Please log in again.");
  }
};