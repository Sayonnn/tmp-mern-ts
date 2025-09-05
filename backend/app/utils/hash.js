import bcrypt from "bcrypt";

/**
 * Hash a password
 * @param {string} password - The password to hash
 * @returns {string} - The hashed password
 */
export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
  };