/**
 * Standardized error response
 * @param {Response} res 
 * @param {number} status 
 * @param {string} message 
 */
export function errorResponse(res, status, message) {
    return res.status(status).json({ error: message });
  }
  

export function throwNewError(message) {
    throw new Error(message);
}