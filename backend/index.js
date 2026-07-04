import "dotenv/config";
import app from "./app.js";
import { logger } from "./lib/logger.js";
import { bootstrapAdmin } from "./db/bootstrap.js";

// Use cPanel-provided port, fallback ONLY for local dev
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

if (!port || Number.isNaN(port)) {
  logger.error("Invalid or missing PORT environment variable");
  process.exit(1);
}

// Start server
const server = app.listen(port, () => {
  logger.info({ port }, `Server listening`);

  // Run bootstrap after server starts
  bootstrapAdmin().catch((err) => {
    logger.error({ err }, "Error bootstrapping admin user");
  });
});

// Proper error handling (app.listen doesn't pass errors in callback)
server.on("error", (err) => {
  logger.error({ err }, "Error starting server");
  process.exit(1);
});