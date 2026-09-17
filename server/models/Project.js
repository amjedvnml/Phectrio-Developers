import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  tags: [{ type: String }],
  featured: { type: Boolean, default: false },
  metrics: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const MongooseProject = mongoose.models.Project || mongoose.model('Project', projectSchema);
