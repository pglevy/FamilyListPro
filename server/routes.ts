import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  // Application routes can be added here when needed
  // All grocery list functionality currently uses client-side storage

  const httpServer = createServer(app);

  return httpServer;
}
