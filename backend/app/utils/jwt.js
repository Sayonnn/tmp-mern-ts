import jwt from "jsonwebtoken";
import { config } from "../configs/index.js";

/**
 * Generate an access token for a user
 * Expiry: 60 minutes
 * @param {Object} user - The user object
 * @returns {string} - The access token
 */
export const generateAccessToken = (user) => {
    if (!user) {
        throw new Error("User not found");
    }

    return jwt.sign(
        {id: user.id, email: user.email, role: user.role,username: user.username,created_at: user.created_at,permissions: user.permissions || [], super_admin: user.super_admin || false}, 
        config.jwt.secret, 
        {expiresIn: config.jwt.access_token_expires_in, algorithm: config.jwt.algorithm}
    );
}

/**
 * Generate a refresh token for a user
 * Expiry: 7 days
 * @param {Object} user - The user object
 * @returns {string} - The refresh token
 */
export const generateRefreshToken = (user) => {
    if (!user) {
        throw new Error("User not found");
    }

    return jwt.sign(
      { id: user.id, email:user.email, role:user.role,username:user.username,created_at:user.created_at,permissions:user.permissions || [], super_admin:user.super_admin || false }, 
      config.jwt.secret, 
      { expiresIn: config.jwt.refresh_token_expires_in, algorithm: config.jwt.algorithm } 
    );
}

/**
 * Verify Token
 * @param {string} token - The token to verify
 * @returns {Object} - The decoded token
 */
export const verifyToken = (token) => {
    return jwt.verify(token, config.jwt.secret);
}