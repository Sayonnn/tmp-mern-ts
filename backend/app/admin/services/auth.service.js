import { startQuery } from "../../utils/query.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

export const registerAdmin = async (
  email,
  password,
  permissions = {},
  super_admin = true,
  username,
  role = "admin"   
) => {
    /** Check Email Exists */
    const checkEmailSql = `SELECT id FROM spm_admins WHERE email = $1`;
    const existingEmail = await startQuery(checkEmailSql, [email]);

    if(existingEmail.rows.length > 0){
        throw { field: "email", message: "This email is already registered." };
    }

    /** Check Username Exists */
    const checkUsernameSql = "SELECT id FROM spm_admins WHERE username = $1";
    const existingUsername = await startQuery(checkUsernameSql, [username]);
  
    if (existingUsername.rows.length > 0) {
      throw { field: "username", message: "This username is already registered." };
    }
  
    /** Hash Password */
    const hashedPassword = await hashPassword(password);

    /** Save Admin */
    const sql = `
      INSERT INTO spm_admins (email, password, super_admin, username, permissions, role)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, email, super_admin, username, permissions, role, created_at
    `;
    const params = [email, hashedPassword, super_admin, username, JSON.stringify(permissions), role];
    const result = await startQuery(sql, params);
    const user = result.rows[0];

    /** Generate Tokens */
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
};

export const loginAdmin = async (username, password) => {
    /** Check Username Exists */
    const checkUserSql = "SELECT id, email, password, permissions, super_admin, username, role, created_at FROM spm_admins WHERE username = $1";
    const existing = await startQuery(checkUserSql, [username]);
  
    if (existing.rows.length === 0) {
      throw { field: "username", message: "This username does not exist." };
    }
  
    const user = existing.rows[0];

    /** Verify Password */
    const isPasswordValid = await comparePassword(password, user.password);
    if(!isPasswordValid){
        throw { field: "password", message: "Incorrect password" };
    }

    /** Generate Tokens */
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    return { user, accessToken, refreshToken };
}
