import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import { getInitialSeedData } from './seedData.js';

import {
  MongooseInquiry
} from '../models/Inquiry.js';

import {
  MongooseAdmin
} from '../models/Admin.js';

import {
  MongooseProject
} from '../models/Project.js';

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const STORE_PATH =
  path.resolve(
    __dirname,
    '../data/store.json'
  );

const isProduction = () =>
  process.env.NODE_ENV === 'production';

export const dbState = {
  mode: 'unknown',
  connected: false,
  message: 'Initializing...'
};

// ======================================
// Embedded development database
// ======================================

class FileStore {
  ensureStore() {
    try {
      const dataDir =
        path.dirname(STORE_PATH);

      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(
          dataDir,
          {
            recursive: true
          }
        );
      }

      if (
        !fs.existsSync(STORE_PATH)
      ) {
        const initial =
          getInitialSeedData(
            bcrypt
          );

        fs.writeFileSync(
          STORE_PATH,
          JSON.stringify(
            initial,
            null,
            2
          ),
          'utf8'
        );
      }
    } catch (err) {
      console.error(
        '[FileStore] Initialization error:',
        err
      );
    }
  }

  read() {
    try {
      this.ensureStore();

      const raw =
        fs.readFileSync(
          STORE_PATH,
          'utf8'
        );

      return JSON.parse(raw);
    } catch (err) {
      console.error(
        '[FileStore] Read error:',
        err
      );

      const initial =
        getInitialSeedData(
          bcrypt
        );

      fs.writeFileSync(
        STORE_PATH,
        JSON.stringify(
          initial,
          null,
          2
        ),
        'utf8'
      );

      return initial;
    }
  }

  write(data) {
    try {
      this.ensureStore();

      fs.writeFileSync(
        STORE_PATH,
        JSON.stringify(
          data,
          null,
          2
        ),
        'utf8'
      );
    } catch (err) {
      console.error(
        '[FileStore] Write error:',
        err
      );
    }
  }
}

let fileStore = null;

const getFileStore = () => {
  if (isProduction()) {
    throw new Error(
      'Embedded JSON storage is disabled in production.'
    );
  }

  if (!fileStore) {
    fileStore =
      new FileStore();

    fileStore.ensureStore();
  }

  return fileStore;
};

// ======================================
// Chainable query helper
// ======================================

const makeChainable = (
  results
) => {
  const query = {
    _data: results,

    sort(sortSpec) {
      if (!sortSpec) {
        return this._data;
      }

      const [
        key,
        direction
      ] =
        Object.entries(
          sortSpec
        )[0] ||
        [
          'createdAt',
          -1
        ];

      const dir =
        direction === -1 ||
        direction === 'desc'
          ? -1
          : 1;

      return [
        ...this._data
      ].sort(
        (a, b) => {
          const valA =
            new Date(
              a[key]
            ).getTime() ||
            a[key];

          const valB =
            new Date(
              b[key]
            ).getTime() ||
            b[key];

          return (
            (
              valA > valB
                ? 1
                : valA <
                    valB
                  ? -1
                  : 0
            ) * dir
          );
        }
      );
    },

    then(
      resolve,
      reject
    ) {
      return Promise.resolve(
        this._data
      ).then(
        resolve,
        reject
      );
    }
  };

  return query;
};

// ======================================
// Fallback Inquiry model
// ======================================

const FallbackInquiry = {
  async find(filter = {}) {
    const store =
      getFileStore().read();

    let items =
      store.inquiries || [];

    if (
      filter.status &&
      filter.status !== 'All'
    ) {
      items =
        items.filter(
          (item) =>
            item.status ===
            filter.status
        );
    }

    if (
      filter.service &&
      filter.service !== 'All'
    ) {
      items =
        items.filter(
          (item) =>
            item.service ===
            filter.service
        );
    }

    return makeChainable(
      items
    );
  },

  async findById(id) {
    const store =
      getFileStore().read();

    return (
      store.inquiries.find(
        (item) =>
          item._id === id ||
          item.id === id
      ) || null
    );
  },

  async create(payload) {
    const store =
      getFileStore().read();

    const id =
      `inq_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`;

    const newDocument = {
      _id: id,
      id,

      name:
        payload.name,

      email:
        payload.email,

      service:
        payload.service,

      budget:
        payload.budget,

      message:
        payload.message,

      status:
        payload.status ||
        'New',

      createdAt:
        new Date().toISOString()
    };

    store.inquiries.unshift(
      newDocument
    );

    getFileStore().write(
      store
    );

    return newDocument;
  },

  async findByIdAndUpdate(
    id,
    update
  ) {
    const store =
      getFileStore().read();

    const index =
      store.inquiries.findIndex(
        (item) =>
          item._id === id ||
          item.id === id
      );

    if (index === -1) {
      return null;
    }

    const updated = {
      ...store.inquiries[
        index
      ],
      ...update
    };

    store.inquiries[
      index
    ] = updated;

    getFileStore().write(
      store
    );

    return updated;
  },

  async findByIdAndDelete(
    id
  ) {
    const store =
      getFileStore().read();

    const index =
      store.inquiries.findIndex(
        (item) =>
          item._id === id ||
          item.id === id
      );

    if (index === -1) {
      return null;
    }

    const deleted =
      store.inquiries.splice(
        index,
        1
      )[0];

    getFileStore().write(
      store
    );

    return deleted;
  },

  async countDocuments(
    filter = {}
  ) {
    const store =
      getFileStore().read();

    let items =
      store.inquiries || [];

    if (filter.status) {
      items =
        items.filter(
          (item) =>
            item.status ===
            filter.status
        );
    }

    return items.length;
  }
};

// ======================================
// Fallback Admin model
// ======================================

const FallbackAdmin = {
  async findOne(
    filter = {}
  ) {
    const store =
      getFileStore().read();

    if (
      filter.email
    ) {
      return (
        store.admin &&
        store.admin.email ===
          filter.email.toLowerCase()
          ? store.admin
          : null
      );
    }

    if (
      filter.username
    ) {
      return (
        store.admin &&
        store.admin.username ===
          filter.username
          ? store.admin
          : null
      );
    }

    return (
      store.admin ||
      null
    );
  },

  async findById(id) {
    const store =
      getFileStore().read();

    if (!store.admin) {
      return null;
    }

    return (
      store.admin._id === id ||
      store.admin.id === id
        ? store.admin
        : null
    );
  },

  async create(payload) {
    const store =
      getFileStore().read();

    const id =
      `admin_${Date.now()}`;

    const newAdmin = {
      _id: id,
      id,
      ...payload,

      createdAt:
        new Date().toISOString()
    };

    store.admin =
      newAdmin;

    getFileStore().write(
      store
    );

    return newAdmin;
  }
};

// ======================================
// Fallback Project model
// ======================================

const FallbackProject = {
  async find(filter = {}) {
    const store =
      getFileStore().read();

    let items =
      store.projects || [];

    if (
      filter.category &&
      filter.category !== 'All'
    ) {
      items =
        items.filter(
          (project) =>
            project.category ===
            filter.category
        );
    }

    if (
      filter.featured !==
      undefined
    ) {
      items =
        items.filter(
          (project) =>
            project.featured ===
            filter.featured
        );
    }

    return makeChainable(
      items
    );
  },

  async create(payload) {
    const store =
      getFileStore().read();

    const id =
      `proj_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`;

    const newProject = {
      _id: id,
      id,

      title:
        payload.title,

      category:
        payload.category,

      description:
        payload.description,

      imageUrl:
        payload.imageUrl,

      tags:
        payload.tags || [],

      featured:
        Boolean(
          payload.featured
        ),

      metrics:
        payload.metrics || '',

      createdAt:
        new Date().toISOString()
    };

    store.projects.unshift(
      newProject
    );

    getFileStore().write(
      store
    );

    return newProject;
  },

  async findByIdAndDelete(
    id
  ) {
    const store =
      getFileStore().read();

    const index =
      store.projects.findIndex(
        (project) =>
          project._id === id ||
          project.id === id
      );

    if (index === -1) {
      return null;
    }

    const deleted =
      store.projects.splice(
        index,
        1
      )[0];

    getFileStore().write(
      store
    );

    return deleted;
  }
};

// ======================================
// Unified model interfaces
// ======================================

export const Inquiry = {
  find: (filter) =>
    dbState.mode ===
    'mongodb'
      ? MongooseInquiry.find(
          filter
        )
      : FallbackInquiry.find(
          filter
        ),

  findById: (id) =>
    dbState.mode ===
    'mongodb'
      ? MongooseInquiry.findById(
          id
        )
      : FallbackInquiry.findById(
          id
        ),

  create: (document) =>
    dbState.mode ===
    'mongodb'
      ? MongooseInquiry.create(
          document
        )
      : FallbackInquiry.create(
          document
        ),

  findByIdAndUpdate: (
    id,
    update,
    options
  ) =>
    dbState.mode ===
    'mongodb'
      ? MongooseInquiry.findByIdAndUpdate(
          id,
          update,
          options
        )
      : FallbackInquiry.findByIdAndUpdate(
          id,
          update,
          options
        ),

  findByIdAndDelete: (
    id
  ) =>
    dbState.mode ===
    'mongodb'
      ? MongooseInquiry.findByIdAndDelete(
          id
        )
      : FallbackInquiry.findByIdAndDelete(
          id
        ),

  countDocuments: (
    filter
  ) =>
    dbState.mode ===
    'mongodb'
      ? MongooseInquiry.countDocuments(
          filter
        )
      : FallbackInquiry.countDocuments(
          filter
        )
};

export const Admin = {
  findOne: (filter) =>
    dbState.mode ===
    'mongodb'
      ? MongooseAdmin.findOne(
          filter
        )
      : FallbackAdmin.findOne(
          filter
        ),

  findById: (id) =>
    dbState.mode ===
    'mongodb'
      ? MongooseAdmin.findById(
          id
        )
      : FallbackAdmin.findById(
          id
        ),

  create: (document) =>
    dbState.mode ===
    'mongodb'
      ? MongooseAdmin.create(
          document
        )
      : FallbackAdmin.create(
          document
        )
};

export const Project = {
  find: (filter) =>
    dbState.mode ===
    'mongodb'
      ? MongooseProject.find(
          filter
        )
      : FallbackProject.find(
          filter
        ),

  create: (document) =>
    dbState.mode ===
    'mongodb'
      ? MongooseProject.create(
          document
        )
      : FallbackProject.create(
          document
        ),

  findByIdAndDelete: (
    id
  ) =>
    dbState.mode ===
    'mongodb'
      ? MongooseProject.findByIdAndDelete(
          id
        )
      : FallbackProject.findByIdAndDelete(
          id
        )
};

// ======================================
// Seed database
// ======================================

export const seedDefaultData =
  async () => {
    const seed =
      getInitialSeedData(
        bcrypt
      );

    if (
      dbState.mode ===
      'mongodb'
    ) {
      const adminCount =
        await MongooseAdmin.countDocuments();

      if (
        adminCount === 0
      ) {
        if (seed.admin) {
          await MongooseAdmin.create(
            seed.admin
          );

          console.log(
            '[MongoDB] Seeded initial admin account.'
          );
        } else {
          console.warn(
            '[MongoDB] No admin exists. Configure ADMIN_INITIAL_PASSWORD before the first production deployment.'
          );
        }
      }

      if (
        seed.inquiries.length >
        0
      ) {
        const inquiryCount =
          await MongooseInquiry.countDocuments();

        if (
          inquiryCount === 0
        ) {
          await MongooseInquiry.insertMany(
            seed.inquiries
          );

          console.log(
            '[MongoDB] Seeded demo inquiries.'
          );
        }
      }

      if (
        seed.projects.length >
        0
      ) {
        const projectCount =
          await MongooseProject.countDocuments();

        if (
          projectCount === 0
        ) {
          await MongooseProject.insertMany(
            seed.projects
          );

          console.log(
            '[MongoDB] Seeded demo projects.'
          );
        }
      }

      return;
    }

    getFileStore().write(
      seed
    );

    console.log(
      '[Embedded DB] Development JSON store seeded.'
    );
  };

// ======================================
// Connect database
// ======================================

export const connectDB =
  async () => {
    const uri =
      process.env.MONGODB_URI;

    if (!uri) {
      if (isProduction()) {
        dbState.mode =
          'mongodb';

        dbState.connected =
          false;

        dbState.message =
          'MONGODB_URI is required in production.';

        throw new Error(
          dbState.message
        );
      }

      console.log(
        '[DB] No MONGODB_URI found. Using development JSON database.'
      );

      dbState.mode =
        'embedded';

      dbState.connected =
        true;

      dbState.message =
        'Development embedded JSON store active';

      await seedDefaultData();

      return;
    }

    try {
      console.log(
        '[DB] Connecting to MongoDB...'
      );

      await mongoose.connect(
        uri,
        {
          serverSelectionTimeoutMS:
            10000,

          connectTimeoutMS:
            10000
        }
      );

      dbState.mode =
        'mongodb';

      dbState.connected =
        true;

      dbState.message =
        'Connected to MongoDB database';

      console.log(
        '>>> [MongoDB] Connected successfully! <<<'
      );

      await seedDefaultData();
    } catch (err) {
      dbState.mode =
        'mongodb';

      dbState.connected =
        false;

      dbState.message =
        'MongoDB connection failed';

      if (
        isProduction()
      ) {
        console.error(
          '[DB] Production MongoDB connection failed:',
          err.message
        );

        throw err;
      }

      console.warn(
        `[DB] MongoDB connection failed (${err.message}). Using development JSON fallback.`
      );

      dbState.mode =
        'embedded';

      dbState.connected =
        true;

      dbState.message =
        'Development JSON fallback active';

      await seedDefaultData();
    }
  };