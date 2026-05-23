import mongoose, { type FilterQuery } from 'mongoose';

import { RecordModel, type AccessRecord, type RecordStatus } from '../models/record.model.js';
import { AppError } from '../utils/app-error.js';

export type SortOrder = 'asc' | 'desc';
export type RecordSortBy = 'createdAt' | 'status' | 'verificationType' | 'accessLevel';

export interface ListRecordsFilters {
  status?: RecordStatus;
  verificationType?: string;
  accessLevel?: string;
  userId?: string;
  approvedBy?: string;
  createdFrom?: Date;
  createdTo?: Date;
}

export interface ListRecordsInput {
  requester: {
    userId: string;
    role: 'admin' | 'user';
  };
  page: number;
  limit: number;
  sortBy: RecordSortBy;
  sortOrder: SortOrder;
  filters: ListRecordsFilters;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const buildFilter = (input: ListRecordsInput): FilterQuery<AccessRecord> => {
  const query: FilterQuery<AccessRecord> = {};

  // Scope to logged-in user by default.
  if (input.requester.role !== 'admin') {
    query.userId = new mongoose.Types.ObjectId(input.requester.userId);
  } else if (input.filters.userId) {
    if (!mongoose.isValidObjectId(input.filters.userId)) {
      throw new AppError('Invalid userId filter', 400);
    }
    query.userId = new mongoose.Types.ObjectId(input.filters.userId);
  }

  if (input.filters.status) {
    query.status = input.filters.status;
  }

  if (input.filters.verificationType) {
    query.verificationType = input.filters.verificationType.trim();
  }

  if (input.filters.accessLevel) {
    query.accessLevel = input.filters.accessLevel.trim();
  }

  if (input.filters.approvedBy) {
    if (!mongoose.isValidObjectId(input.filters.approvedBy)) {
      throw new AppError('Invalid approvedBy filter', 400);
    }
    query.approvedBy = new mongoose.Types.ObjectId(input.filters.approvedBy);
  }

  if (input.filters.createdFrom || input.filters.createdTo) {
    query.createdAt = {};

    if (input.filters.createdFrom) {
      query.createdAt.$gte = input.filters.createdFrom;
    }

    if (input.filters.createdTo) {
      query.createdAt.$lte = input.filters.createdTo;
    }
  }

  return query;
};

export const listRecords = async (input: ListRecordsInput): Promise<PaginatedResult<AccessRecord>> => {
  const filter = buildFilter(input);

  const sortDirection = input.sortOrder === 'asc' ? 1 : -1;
  const sort: Record<string, 1 | -1> = {
    [input.sortBy]: sortDirection,
    _id: -1,
  };

  const skip = (input.page - 1) * input.limit;

  const [items, total] = await Promise.all([
    RecordModel.find(filter).sort(sort).skip(skip).limit(input.limit).lean<AccessRecord[]>().exec(),
    RecordModel.countDocuments(filter).exec(),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / input.limit));

  return {
    items,
    page: input.page,
    limit: input.limit,
    total,
    totalPages,
  };
};

export const getRecordById = async (
  id: string,
  requester: { userId: string; role: 'admin' | 'user' },
): Promise<AccessRecord> => {
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError('Invalid record id', 400);
  }

  const record = await RecordModel.findById(id).lean<AccessRecord>().exec();
  if (!record) {
    throw new AppError('Record not found', 404);
  }

  if (requester.role !== 'admin' && String(record.userId) !== requester.userId) {
    // Do not leak existence.
    throw new AppError('Record not found', 404);
  }

  return record;
};
