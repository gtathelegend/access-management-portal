export type RecordStatus = 'pending' | 'approved' | 'rejected';

export interface VerificationRecord {
  _id: string;
  userId: string;
  verificationType: string;
  status: RecordStatus;
  approvedBy?: string | null;
  accessLevel: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordsListResponse {
  items: VerificationRecord[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type RecordSortBy = 'createdAt' | 'status' | 'verificationType' | 'accessLevel';
export type SortOrder = 'asc' | 'desc';

export interface ListRecordsParams {
  page?: number;
  limit?: number;
  sortBy?: RecordSortBy;
  sortOrder?: SortOrder;
  status?: RecordStatus;
  verificationType?: string;
  accessLevel?: string;
  userId?: string;
  approvedBy?: string;
  createdFrom?: string;
  createdTo?: string;
  delayMs?: number;
}
