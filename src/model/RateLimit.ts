import mongoose, { Schema, Document } from 'mongoose';

export interface IRateLimit extends Document {
  ip: string;
  count: number;
  createdAt: Date;
}

const RateLimitSchema: Schema = new Schema({
  ip: { type: String, required: true },
  count: { type: Number, default: 0 },
  // This tells MongoDB: "Delete this document 60 seconds after createdAt"
  createdAt: { type: Date, default: Date.now, expires: 60 }, 
});

const RateLimitModel =
  (mongoose.models.RateLimit as mongoose.Model<IRateLimit>) ||
  mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);

export default RateLimitModel;