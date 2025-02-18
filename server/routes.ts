import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertPlatformSchema, insertScheduledPostSchema, insertNoteSchema, insertWishlistSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Platform routes
  app.get("/api/platforms", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    let platforms = await storage.getPlatforms(req.user.id);

    // If no platforms exist for the user, create default entries
    if (platforms.length === 0) {
      const defaultPlatforms = [
        'instagram', 'facebook', 'whatsapp', 'telegram', 
        'youtube', 'threads', 'linkedin', 'tiktok', 
        'pinterest', 'twitter'
      ];

      for (const type of defaultPlatforms) {
        await storage.createPlatform({
          userId: req.user.id,
          type,
          connected: false,
          metrics: "{}",
        });
      }

      platforms = await storage.getPlatforms(req.user.id);
    }

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

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const notes = await storage.getNotes(req.user.id);
    res.json(notes);
  });

  app.post("/api/notes", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const data = insertNoteSchema.parse(req.body);
    const note = await storage.createNote({
      ...data,
      userId: req.user.id,
    });
    res.status(201).json(note);
  });

  // Wishlist routes
  app.get("/api/wishlist", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const items = await storage.getWishlistItems(req.user.id);
    res.json(items);
  });

  app.post("/api/wishlist", async (req, res) => {
    if (!req.user) return res.sendStatus(401);
    const data = insertWishlistSchema.parse(req.body);
    const item = await storage.createWishlistItem({
      ...data,
      userId: req.user.id,
    });
    res.status(201).json(item);
  });

  const httpServer = createServer(app);
  return httpServer;
}