import { startQuery } from "../utils/query.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

/**
 * Register a new client
 * @param {string} email 
 * @param {string} password
 * @returns {Object} user, accessToken, refreshToken
 */
export async function registerClient(email, password) {
  // Check if email already exists
  const checkSql = "SELECT id FROM uge_clients WHERE email = $1";
  const existing = await startQuery(checkSql, [email]);

  if (existing.rows.length > 0) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Save client (force role = 'client')
  const sql = `
    INSERT INTO uge_clients (email, password, username, role)
    VALUES ($1, $2, $3, 'client')
    RETURNING id, email, role, username, created_at
  `;
  const params = [email, hashedPassword, username];
  const result = await startQuery(sql, params);
  const user = result.rows[0];

  // Generate tokens
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
export async function loginClient(email, password) {
  // Check if email exists
  const checkSql = "SELECT id, email, password, role FROM uge_clients WHERE email = $1";
  const existing = await startQuery(checkSql, [email]);

  if (existing.rows.length === 0) {
    throw new Error("Email not found");
  }

  const user = existing.rows[0];

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  // Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
}
