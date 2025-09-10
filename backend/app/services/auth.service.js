import { startQuery } from "../utils/query.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

/** 
 * Register a new client
 * @param {string} email 
 * @param {string} password
 * @returns {Object} user, accessToken, refreshToken
 * NOTE: prevent duplicate email and username
 */
export async function registerClient(email, password, username) {
  // Check if email already exists
  const checkEmailSql = "SELECT id FROM spm_clients WHERE email = $1";
  const existingEmail = await startQuery(checkEmailSql, [email]);

  if (existingEmail.rows.length > 0) {
    throw { field: "email", message: "This email is already registered." };
  }

  const checkUsernameSql = "SELECT id FROM spm_clients WHERE username = $1";
  const existingUsername = await startQuery(checkUsernameSql, [username]);

  if (existingUsername.rows.length > 0) {
    throw { field: "username", message: "This username is already registered." };
  }

  /** Hash Password */
  const hashedPassword = await hashPassword(password);

  /** Save Client (force role = 'client') */
  const sql = `
    INSERT INTO spm_clients (email, password, username, role)
    VALUES ($1, $2, $3, 'client')
    RETURNING id, email, role, username, created_at
  `;
  const params = [email, hashedPassword, username];
  const result = await startQuery(sql, params);
  const user = result.rows[0];

  /** Generate Tokens */
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
}

/**
 * Login a client
 * @param {string} email
 * @param {string} password
 * @returns {Object} user, accessToken, refreshToken
 */
export async function loginClient(username, password) {
  const checkUserSql = "SELECT id, email, password, role, username, created_at FROM spm_clients WHERE username = $1";
  const existing = await startQuery(checkUserSql, [username]);

  if (existing.rows.length === 0) {
    throw { field: "username", message: "This username does not exist." };
  }

  const user = existing.rows[0];

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw { field: "password", message: "The password you entered is incorrect." };
  }

  /** Generate Tokens */
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
}
