import { users, type User, type InsertUser, platforms, type Platform, scheduledPosts, type ScheduledPost, notes, type Note, wishlist, type Wishlist } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Platform methods
  getPlatforms(userId: number): Promise<Platform[]>;
  getPlatformByType(userId: number, type: string): Promise<Platform | undefined>;
  createPlatform(platform: Omit<Platform, "id">): Promise<Platform>;

  // Scheduled posts methods
  getScheduledPosts(userId: number): Promise<ScheduledPost[]>;
  createScheduledPost(post: Omit<ScheduledPost, "id">): Promise<ScheduledPost>;

  // Notes methods
  getNotes(userId: number): Promise<Note[]>;
  createNote(note: Omit<Note, "id">): Promise<Note>;

  // Wishlist methods
  getWishlistItems(userId: number): Promise<Wishlist[]>;
  createWishlistItem(item: Omit<Wishlist, "id">): Promise<Wishlist>;

  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private platforms: Map<number, Platform>;
  private scheduledPosts: Map<number, ScheduledPost>;
  private notes: Map<number, Note>;
  private wishlistItems: Map<number, Wishlist>;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.platforms = new Map();
    this.scheduledPosts = new Map();
    this.notes = new Map();
    this.wishlistItems = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getPlatforms(userId: number): Promise<Platform[]> {
    return Array.from(this.platforms.values()).filter(
      (platform) => platform.userId === userId
    );
  }

  async getPlatformByType(userId: number, type: string): Promise<Platform | undefined> {
    return Array.from(this.platforms.values()).find(
      (platform) => platform.userId === userId && platform.type === type
    );
  }

  async createPlatform(platform: Omit<Platform, "id">): Promise<Platform> {
    const id = this.currentId++;
    const newPlatform: Platform = { ...platform, id };
    this.platforms.set(id, newPlatform);
    return newPlatform;
  }

  async getScheduledPosts(userId: number): Promise<ScheduledPost[]> {
    return Array.from(this.scheduledPosts.values()).filter(
      (post) => post.userId === userId
    );
  }

  async createScheduledPost(post: Omit<ScheduledPost, "id">): Promise<ScheduledPost> {
    const id = this.currentId++;
    const newPost: ScheduledPost = { ...post, id };
    this.scheduledPosts.set(id, newPost);
    return newPost;
  }

  async getNotes(userId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (note) => note.userId === userId
    );
  }

  async createNote(note: Omit<Note, "id">): Promise<Note> {
    const id = this.currentId++;
    const newNote: Note = { ...note, id, createdAt: new Date() };
    this.notes.set(id, newNote);
    return newNote;
  }

  async getWishlistItems(userId: number): Promise<Wishlist[]> {
    return Array.from(this.wishlistItems.values()).filter(
      (item) => item.userId === userId
    );
  }

  async createWishlistItem(item: Omit<Wishlist, "id">): Promise<Wishlist> {
    const id = this.currentId++;
    const newItem: Wishlist = { ...item, id, createdAt: new Date() };
    this.wishlistItems.set(id, newItem);
    return newItem;
  }
}

export const storage = new MemStorage();