import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { getInitialSeedData } from './seedData.js';
import { MongooseInquiry } from '../models/Inquiry.js';
import { MongooseAdmin } from '../models/Admin.js';
import { MongooseProject } from '../models/Project.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.resolve(__dirname, '../data/store.json');

export const dbState = {
  mode: 'unknown',
  connected: false,
  message: 'Initializing...'
};

// In-Memory / File-based Store Adapter
class FileStore {
  constructor() {
    this.ensureStore();
  }

  ensureStore() {
    try {
      const dataDir = path.dirname(STORE_PATH);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      if (!fs.existsSync(STORE_PATH)) {
        const initial = getInitialSeedData(bcrypt);
        fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
      }
    } catch (err) {
      console.error('[FileStore] Initialization error:', err);
    }
  }

  read() {
    try {
      this.ensureStore();
      const raw = fs.readFileSync(STORE_PATH, 'utf8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('[FileStore] Read error, resetting default seed:', err);
      const initial = getInitialSeedData(bcrypt);
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8');
      return initial;
    }
  }

  write(data) {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.error('[FileStore] Write error:', err);
    }
  }
}

const fileStore = new FileStore();

// Chainable query helper for embedded mode
const makeChainable = (results) => {
  const query = {
    _data: results,
    sort(sortSpec) {
      if (!sortSpec) return this._data;
      const [key, direction] = Object.entries(sortSpec)[0] || ['createdAt', -1];
      const dir = direction === -1 || direction === 'desc' ? -1 : 1;
      return [...this._data].sort((a, b) => {
        const valA = new Date(a[key]).getTime() || a[key];
        const valB = new Date(b[key]).getTime() || b[key];
        return (valA > valB ? 1 : valA < valB ? -1 : 0) * dir;
      });
    },
    then(resolve, reject) {
      return Promise.resolve(this._data).then(resolve, reject);
    }
  };
  return query;
};

// Fallback Model Interfaces
const FallbackInquiry = {
  async find(filter = {}) {
    const store = fileStore.read();
    let items = store.inquiries || [];
    if (filter.status && filter.status !== 'All') {
      items = items.filter(i => i.status === filter.status);
    }
    if (filter.service && filter.service !== 'All') {
      items = items.filter(i => i.service === filter.service);
    }
    return makeChainable(items);
  },

  async findById(id) {
    const store = fileStore.read();
    return store.inquiries.find(i => i._id === id || i.id === id) || null;
  },

  async create(payload) {
    const store = fileStore.read();
    const id = 'inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newDoc = {
      _id: id,
      id: id,
      name: payload.name,
      email: payload.email,
      service: payload.service,
      budget: payload.budget,
      message: payload.message,
      status: payload.status || 'New',
      createdAt: new Date().toISOString()
    };
    store.inquiries.unshift(newDoc);
    fileStore.write(store);
    return newDoc;
  },

  async findByIdAndUpdate(id, update, options = { new: true }) {
    const store = fileStore.read();
    const index = store.inquiries.findIndex(i => i._id === id || i.id === id);
    if (index === -1) return null;
    const current = store.inquiries[index];
    const updated = { ...current, ...update };
    store.inquiries[index] = updated;
    fileStore.write(store);
    return updated;
  },

  async findByIdAndDelete(id) {
    const store = fileStore.read();
    const index = store.inquiries.findIndex(i => i._id === id || i.id === id);
    if (index === -1) return null;
    const deleted = store.inquiries.splice(index, 1)[0];
    fileStore.write(store);
    return deleted;
  },

  async countDocuments(filter = {}) {
    const store = fileStore.read();
    let items = store.inquiries || [];
    if (filter.status) items = items.filter(i => i.status === filter.status);
    return items.length;
  }
};

const FallbackAdmin = {
  async findOne(filter = {}) {
    const store = fileStore.read();
    if (filter.email) {
      return store.admin && store.admin.email === filter.email.toLowerCase() ? store.admin : null;
    }
    if (filter.username) {
      return store.admin && store.admin.username === filter.username ? store.admin : null;
    }
    return store.admin || null;
  },

  async findById(id) {
    const store = fileStore.read();
    return store.admin && (store.admin._id === id || store.admin.id === id) ? store.admin : null;
  },

  async create(payload) {
    const store = fileStore.read();
    const id = 'admin_' + Date.now();
    const newAdmin = {
      _id: id,
      id: id,
      ...payload,
      createdAt: new Date().toISOString()
    };
    store.admin = newAdmin;
    fileStore.write(store);
    return newAdmin;
  }
};

const FallbackProject = {
  async find(filter = {}) {
    const store = fileStore.read();
    let items = store.projects || [];
    if (filter.category && filter.category !== 'All') {
      items = items.filter(p => p.category === filter.category);
    }
    if (filter.featured !== undefined) {
      items = items.filter(p => p.featured === filter.featured);
    }
    return makeChainable(items);
  },

  async create(payload) {
    const store = fileStore.read();
    const id = 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newProj = {
      _id: id,
      id: id,
      title: payload.title,
      category: payload.category,
      description: payload.description,
      imageUrl: payload.imageUrl,
      tags: payload.tags || [],
      featured: Boolean(payload.featured),
      metrics: payload.metrics || '',
      createdAt: new Date().toISOString()
    };
    store.projects.unshift(newProj);
    fileStore.write(store);
    return newProj;
  },

  async findByIdAndDelete(id) {
    const store = fileStore.read();
    const index = store.projects.findIndex(p => p._id === id || p.id === id);
    if (index === -1) return null;
    const deleted = store.projects.splice(index, 1)[0];
    fileStore.write(store);
    return deleted;
  }
};

// Unified Model Dispatchers
export const Inquiry = {
  find: (f) => (dbState.mode === 'mongodb' ? MongooseInquiry.find(f) : FallbackInquiry.find(f)),
  findById: (id) => (dbState.mode === 'mongodb' ? MongooseInquiry.findById(id) : FallbackInquiry.findById(id)),
  create: (doc) => (dbState.mode === 'mongodb' ? MongooseInquiry.create(doc) : FallbackInquiry.create(doc)),
  findByIdAndUpdate: (id, u, o) => (dbState.mode === 'mongodb' ? MongooseInquiry.findByIdAndUpdate(id, u, o) : FallbackInquiry.findByIdAndUpdate(id, u, o)),
  findByIdAndDelete: (id) => (dbState.mode === 'mongodb' ? MongooseInquiry.findByIdAndDelete(id) : FallbackInquiry.findByIdAndDelete(id)),
  countDocuments: (f) => (dbState.mode === 'mongodb' ? MongooseInquiry.countDocuments(f) : FallbackInquiry.countDocuments(f))
};

export const Admin = {
  findOne: (f) => (dbState.mode === 'mongodb' ? MongooseAdmin.findOne(f) : FallbackAdmin.findOne(f)),
  findById: (id) => (dbState.mode === 'mongodb' ? MongooseAdmin.findById(id) : FallbackAdmin.findById(id)),
  create: (doc) => (dbState.mode === 'mongodb' ? MongooseAdmin.create(doc) : FallbackAdmin.create(doc))
};

export const Project = {
  find: (f) => (dbState.mode === 'mongodb' ? MongooseProject.find(f) : FallbackProject.find(f)),
  create: (doc) => (dbState.mode === 'mongodb' ? MongooseProject.create(doc) : FallbackProject.create(doc)),
  findByIdAndDelete: (id) => (dbState.mode === 'mongodb' ? MongooseProject.findByIdAndDelete(id) : FallbackProject.findByIdAndDelete(id))
};

// Re-seed helper
export const seedDefaultData = async () => {
  const seed = getInitialSeedData(bcrypt);
  if (dbState.mode === 'mongodb') {
    const adminCount = await MongooseAdmin.countDocuments();
    if (adminCount === 0) {
      await MongooseAdmin.create(seed.admin);
      console.log('[MongoDB] Seeded default superadmin.');
    }
    const inquiryCount = await MongooseInquiry.countDocuments();
    if (inquiryCount === 0) {
      await MongooseInquiry.insertMany(seed.inquiries);
      console.log('[MongoDB] Seeded default inquiries.');
    }
    const projectCount = await MongooseProject.countDocuments();
    if (projectCount === 0) {
      await MongooseProject.insertMany(seed.projects);
      console.log('[MongoDB] Seeded default projects.');
    }
  } else {
    fileStore.write(seed);
    console.log('[Embedded DB] Pre-seeded embedded JSON data store.');
  }
};

// Initialize DB with rapid failover to embedded storage
export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[DB] No MONGODB_URI specified. Operating in high-performance embedded JSON store mode.');
    dbState.mode = 'embedded';
    dbState.connected = true;
    dbState.message = 'Embedded JSON Data Store Active (Data persisted to server/data/store.json)';
    await seedDefaultData();
    return;
  }

  try {
    console.log('[DB] Attempting connection to MongoDB at', uri, '...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    dbState.mode = 'mongodb';
    dbState.connected = true;
    dbState.message = 'Connected to MongoDB Database';
    console.log('>>> [MongoDB] Connected successfully! <<<');
    await seedDefaultData();
  } catch (err) {
    console.warn(`[DB] MongoDB connection failed (${err.message}). Activating embedded resilient JSON store fallback.`);
    dbState.mode = 'embedded';
    dbState.connected = true;
    dbState.message = 'Active: Resilient JSON Store (Fallback mode)';
    await seedDefaultData();
  }
};
