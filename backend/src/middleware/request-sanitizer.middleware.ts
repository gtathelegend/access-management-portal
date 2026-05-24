import type { NextFunction, Request, Response } from 'express';

const DANGEROUS_KEY_PATTERN = /(^\$)|\.|(^__proto__$)|(^constructor$)|(^prototype$)/;

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const sanitizeValue = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (!isPlainObject(value)) {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !DANGEROUS_KEY_PATTERN.test(key))
      .map(([key, nestedValue]) => [key, sanitizeValue(nestedValue)]),
  );
};

export const requestSanitizer = (req: Request, _res: Response, next: NextFunction): void => {
  if (req.body !== undefined) {
    req.body = sanitizeValue(req.body);
  }

  if (req.query !== undefined) {
    req.query = sanitizeValue(req.query) as Request['query'];
  }

  if (req.params !== undefined) {
    req.params = sanitizeValue(req.params) as Request['params'];
  }

  next();
};