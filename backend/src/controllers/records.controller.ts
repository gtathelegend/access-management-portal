import type { Request, Response } from 'express';

import { AppError } from '../utils/app-error.js';
import { getRecordById, listRecords, type RecordSortBy, type SortOrder } from '../services/records.service.js';
import type { RecordStatus } from '../models/record.model.js';

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
};

const parseDate = (value: unknown): Date | undefined => {
  if (typeof value !== 'string' || value.trim() === '') {
    return undefined;
  }

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new AppError(`Invalid date: ${value}`, 400);
  }

  return d;
};

const parseSortBy = (value: unknown): RecordSortBy => {
  if (value === 'status' || value === 'verificationType' || value === 'accessLevel' || value === 'createdAt') {
    return value;
  }
  return 'createdAt';
};

const parseSortOrder = (value: unknown): SortOrder => {
  if (value === 'asc' || value === 'desc') {
    return value;
  }
  return 'desc';
};

const parseStatus = (value: unknown): RecordStatus | undefined => {
  if (value === 'pending' || value === 'approved' || value === 'rejected') {
    return value;
  }
  return undefined;
};

export const getRecords = async (req: Request, res: Response): Promise<void> => {
  if (!req.auth) {
    throw new AppError('Unauthorized', 401);
  }

  const page = Math.max(1, Math.floor(parseNumber(req.query.page) ?? 1));
  const limit = Math.min(100, Math.max(1, Math.floor(parseNumber(req.query.limit) ?? 20)));

  const sortBy = parseSortBy(req.query.sortBy);
  const sortOrder = parseSortOrder(req.query.sortOrder);

  const status = parseStatus(req.query.status);

  const verificationType = typeof req.query.verificationType === 'string' ? req.query.verificationType : undefined;
  const accessLevel = typeof req.query.accessLevel === 'string' ? req.query.accessLevel : undefined;
  const userId = typeof req.query.userId === 'string' ? req.query.userId : undefined;
  const approvedBy = typeof req.query.approvedBy === 'string' ? req.query.approvedBy : undefined;

  const createdFrom = parseDate(req.query.createdFrom);
  const createdTo = parseDate(req.query.createdTo);

  const result = await listRecords({
    requester: req.auth,
    page,
    limit,
    sortBy,
    sortOrder,
    filters: {
      status,
      verificationType,
      accessLevel,
      userId,
      approvedBy,
      createdFrom,
      createdTo,
    },
  });

  res.status(200).json(result);
};

export const getRecord = async (req: Request, res: Response): Promise<void> => {
  if (!req.auth) {
    throw new AppError('Unauthorized', 401);
  }

  const record = await getRecordById(req.params.id, req.auth);
  res.status(200).json(record);
};
