import express from 'express'
const router = express.Router();

/**
 * POST /api/logs
 * Accepts error logs from frontend and optionally stores or forwards them
 */
router.post("/logs", (req, res) => {
    try {
      const { message, stack, context } = req.body;
  
      if (!message) {
        return res.status(400).json({ error: "Log message is required" });
      }
  
      // Optional: add context info
      const logMessage = context ? `[${context}] ${message}` : message;
  
      // For now, just log to console
      console.error("Frontend Log:", logMessage);
      if (stack) console.error(stack);
  
      // Future: save to DB, Sentry, or monitoring service
  
      res.status(200).json({ success: true, message: "Log received" });
    } catch (error) {
      console.error("API /logs Error:", error.message || error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

export default router;