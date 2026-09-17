import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  service: { 
    type: String, 
    required: true,
    enum: ['Web Development', 'App Development', 'UI/UX Design', 'Other']
  },
  budget: { type: String, required: true },
  message: { type: String, required: true },
  status: { 
    type: String, 
    default: 'New',
    enum: ['New', 'In Progress', 'Completed', 'Archived']
  },
  createdAt: { type: Date, default: Date.now }
});

export const MongooseInquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
