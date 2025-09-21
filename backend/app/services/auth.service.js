import User from "../models/User.model.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

/**
 * Register a new client
 * @param {string} email
 * @param {string} password
 * @param {string} username
 * @returns {Object} user, accessToken, refreshToken
 */
export const registerClient = async (email, password, username) => {
  // Check if email exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw { field: "email", message: "This email is already registered." };
  }

  // Check if username exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw { field: "username", message: "This username is already registered." };
  }

  // Create new client (role = 'client')
  const client = new User({
    email,
    password, // will be hashed by schema pre-save hook
    username,
    role: "client",
  });

  await client.save();

  // Prepare safe user object (exclude password)
  const user = {
    id: client._id,
    email: client.email,
    username: client.username,
    role: client.role,
    permissions: client.permissions,
    created_at: client.createdAt,
  };

  // Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

/**
 * Login a client
 * @param {string} username
 * @param {string} password
 * @returns {Object} user, accessToken, refreshToken
 */
export const loginClient = async (username, password) => {
  // Find user by username
  const client = await User.findOne({ username });
  if (!client) {
    throw { field: "username", message: "This username does not exist." };
  }

  // Verify password
  const isPasswordValid = await client.comparePassword(password);
  if (!isPasswordValid) {
    throw { field: "password", message: "Incorrect password." };
  }

  // Prepare safe user object
  const user = {
    id: client._id,
    email: client.email,
    username: client.username,
    role: client.role,
    permissions: client.permissions,
    created_at: client.createdAt,
  };

  // Generate Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};
