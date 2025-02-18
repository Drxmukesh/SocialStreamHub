import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPlatformSchema, insertScheduledPostSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Platform routes
  app.get("/api/platforms", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const platforms = await storage.getPlatforms(req.user.id);
    res.json(platforms);
  });

  app.get("/api/platforms/:type", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const platform = await storage.getPlatformByType(req.user.id, req.params.type);
    if (!platform) return res.sendStatus(404);
    res.json(platform);
  });

  app.post("/api/platforms", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const data = insertPlatformSchema.parse(req.body);
    const platform = await storage.createPlatform({
      ...data,
      userId: req.user.id,
    });
    res.status(201).json(platform);
  });

  // Scheduled posts routes
  app.get("/api/scheduled-posts", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const posts = await storage.getScheduledPosts(req.user.id);
    res.json(posts);
  });

  app.post("/api/scheduled-posts", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const data = insertScheduledPostSchema.parse(req.body);
    const post = await storage.createScheduledPost({
      ...data,
      userId: req.user.id,
    });
    res.status(201).json(post);
  });

  const httpServer = createServer(app);
  return httpServer;
}
