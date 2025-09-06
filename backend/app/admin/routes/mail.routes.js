 import express from "express";
 import { startSendingSystemEmail } from "../controllers/mail.controller.js";
 const router = express.Router();
 
 /** 
  * Send Email 
  * @param {Object} req - The request object
  * @param {Object} res - The response object
  * @returns {Object} {message}
  */
 router.post("/send", startSendingSystemEmail);
  
 export default router; 