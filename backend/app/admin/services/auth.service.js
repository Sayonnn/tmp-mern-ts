import Admin from "../models/Admin.model.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.js";

/**
 * Register a new admin
 */
export const registerAdmin = async (
  email,
  password,
  permissions = [1],  // default permissions
  super_admin = false,
  username,
  role = "admin"
) => {
  /** Check if email exists */
  const existingEmail = await Admin.findOne({ email });
  if (existingEmail) {
    throw { field: "email", message: "This email is already registered." };
  }

  /** Check if username exists */
  const existingUsername = await Admin.findOne({ username });
  if (existingUsername) {
    throw { field: "username", message: "This username is already registered." };
  }

  /** Create new admin */
  const admin = new Admin({
    email,
    password, // will be hashed by schema pre-save hook
    username,
    super_admin,
    role,
    permissions,
  });

  await admin.save();

  /** Prepare safe user object (exclude password) */
  const user = {
    id: admin._id,
    email: admin.email,
    username: admin.username,
    role: admin.role,
    permissions: admin.permissions,
    super_admin: admin.super_admin,
    created_at: admin.createdAt,
  };

  /** Generate Tokens */
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

/**
 * Login an admin
 */
export const loginAdmin = async (username, password) => {
  /** Check username exists */
  const admin = await Admin.findOne({ username });
  if (!admin) {
    throw { field: "username", message: "This username does not exist." };
  }

  /** Verify password */
  const isPasswordValid = await admin.comparePassword(password);
  if (!isPasswordValid) {
    throw { field: "password", message: "Incorrect password" };
  }

  /** Prepare safe user object */
  const user = {
    id: admin._id,
    email: admin.email,
    username: admin.username,
    role: admin.role,
    permissions: admin.permissions,
    super_admin: admin.super_admin,
    created_at: admin.createdAt,
  };

  /** Generate Tokens */
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};
