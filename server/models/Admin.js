import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, default: 'superadmin' },
  createdAt: { type: Date, default: Date.now }
});

export const MongooseAdmin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
