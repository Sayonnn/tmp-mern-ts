import { pool } from "../configs/database.js";


/** 
 * Start a database query
 * @param {string} sql - The SQL query to execute
 * @param {Array} params - The parameters for the query
 * @returns {Promise} - A promise that resolves to the result of the query
*/
export const startQuery = (sql, params = []) => {
  if (!sql) {
    return Promise.reject(new Error("Query is required"));
  }

  return new Promise((resolve, reject) => {
    pool.query(sql, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};
