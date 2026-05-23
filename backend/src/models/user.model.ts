import bcrypt from 'bcryptjs';
import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose';

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'disabled';

export interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<User, UserMethods>;
export type UserModelType = Model<User, {}, UserMethods>;

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const userSchema = new Schema<User, UserModelType, UserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name must be at most 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, 'Email is invalid'],
      maxlength: [254, 'Email is too long'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [200, 'Password is too long'],
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: {
        values: ['admin', 'user'],
        message: 'Role must be admin or user',
      },
      default: 'user',
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['active', 'disabled'],
        message: 'Status must be active or disabled',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = (mongoose.models.User as UserModelType | undefined) ??
  mongoose.model<User, UserModelType>('User', userSchema);
