import mongoose, { Schema, type HydratedDocument, type Model, Types } from 'mongoose';

export type RecordStatus = 'pending' | 'approved' | 'rejected';

export interface AccessRecord {
  userId: Types.ObjectId;
  verificationType: string;
  status: RecordStatus;
  approvedBy?: Types.ObjectId | null;
  accessLevel: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AccessRecordDocument = HydratedDocument<AccessRecord>;
export type AccessRecordModelType = Model<AccessRecord>;

const recordSchema = new Schema<AccessRecord>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    verificationType: {
      type: String,
      required: [true, 'verificationType is required'],
      trim: true,
      minlength: [2, 'verificationType must be at least 2 characters'],
      maxlength: [80, 'verificationType must be at most 80 characters'],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'status must be pending, approved, or rejected',
      },
      default: 'pending',
      index: true,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    accessLevel: {
      type: String,
      required: [true, 'accessLevel is required'],
      trim: true,
      minlength: [2, 'accessLevel must be at least 2 characters'],
      maxlength: [50, 'accessLevel must be at most 50 characters'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

recordSchema.index({ userId: 1, createdAt: -1 });
recordSchema.index({ status: 1, createdAt: -1 });

export const RecordModel = (mongoose.models.Record as AccessRecordModelType | undefined) ??
  mongoose.model<AccessRecord, AccessRecordModelType>('Record', recordSchema);
