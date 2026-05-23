import mongoose from 'mongoose';

import { UserModel, type UserRole, type UserStatus } from '../models/user.model.js';
import { AppError } from '../utils/app-error.js';

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListFilters {
  role?: UserRole;
  status?: UserStatus;
  q?: string;
}

export interface ListUsersInput {
  page: number;
  limit: number;
  filters: UserListFilters;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserDto {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const toDto = (user: {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}): UserDto => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const listUsers = async (input: ListUsersInput): Promise<PaginatedResult<UserDto>> => {
  const skip = (input.page - 1) * input.limit;

  const filter: Record<string, unknown> = {};

  if (input.filters.role) {
    filter.role = input.filters.role;
  }

  if (input.filters.status) {
    filter.status = input.filters.status;
  }

  const q = input.filters.q?.trim();
  if (q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    filter.$or = [{ name: re }, { email: re }];
  }

  const [items, total] = await Promise.all([
    UserModel.find(filter)
      .select('name email role status createdAt updatedAt')
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(input.limit)
      .lean<Array<{ _id: mongoose.Types.ObjectId; name: string; email: string; role: UserRole; status: UserStatus; createdAt: Date; updatedAt: Date }>>()
      .exec(),
    UserModel.countDocuments(filter).exec(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / input.limit));

  return {
    items: items.map(toDto),
    page: input.page,
    limit: input.limit,
    total,
    totalPages,
  };
};

export const createUser = async (input: CreateUserInput): Promise<UserDto> => {
  const email = normalizeEmail(input.email);

  const existing = await UserModel.findOne({ email }).select('_id').lean().exec();
  if (existing) {
    throw new AppError('Email already in use', 409);
  }

  const user = await UserModel.create({
    name: input.name,
    email,
    password: input.password,
    role: input.role ?? 'user',
    status: input.status ?? 'active',
  });

  return toDto({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
};

export const updateUser = async (id: string, input: UpdateUserInput): Promise<UserDto> => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400);
  }

  if (input.email) {
    const email = normalizeEmail(input.email);
    const duplicate = await UserModel.findOne({ email, _id: { $ne: id } }).select('_id').lean().exec();
    if (duplicate) {
      throw new AppError('Email already in use', 409);
    }
  }

  const update: Record<string, unknown> = {};
  if (typeof input.name === 'string') update.name = input.name;
  if (typeof input.email === 'string') update.email = normalizeEmail(input.email);
  if (input.role) update.role = input.role;
  if (input.status) update.status = input.status;

  const user = await UserModel.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
    projection: 'name email role status createdAt updatedAt',
  })
    .lean<{ _id: mongoose.Types.ObjectId; name: string; email: string; role: UserRole; status: UserStatus; createdAt: Date; updatedAt: Date } | null>()
    .exec();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return toDto(user);
};

export const deleteUser = async (id: string): Promise<void> => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid user id', 400);
  }

  const deleted = await UserModel.findByIdAndDelete(id).select('_id').lean().exec();
  if (!deleted) {
    throw new AppError('User not found', 404);
  }
};
