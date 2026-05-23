import mongoose, { Schema } from 'mongoose';

export interface User {
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true, index: true, trim: true },
    displayName: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const UserModel = mongoose.models.User ?? mongoose.model<User>('User', userSchema);
