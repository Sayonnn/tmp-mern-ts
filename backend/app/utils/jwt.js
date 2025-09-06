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
        {id: user.id, email: user.email, role: user.role}, 
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
      { id: user.id, email:user.email, role:user.role }, 
      config.jwt.secret, 
      { expiresIn: config.jwt.refresh_token_expires_in, algorithm: config.jwt.algorithm } 
    );
}

/**
 * Generate access and refresh tokens for a user
 * @param {Object} user - The user object
 * @returns {Object} - The access and refresh tokens
 */
export const generateTokens = (user) => {
    if(!user) {
        throw new Error("User not found");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { accessToken, refreshToken };
}