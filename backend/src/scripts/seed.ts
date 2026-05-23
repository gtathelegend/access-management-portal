import { connectDb, disconnectDb } from '../config/db.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { UserModel, type UserRole, type UserStatus } from '../models/user.model.js';
import { RecordModel, type RecordStatus } from '../models/record.model.js';

interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
}

interface SeedRecord {
  userEmail: string;
  verificationType: string;
  status: RecordStatus;
  accessLevel: string;
  approvedByEmail?: string;
}

const seedUsers: SeedUser[] = [
  {
    name: 'System Admin',
    email: 'admin@amp.local',
    password: 'Admin@1234',
    role: 'admin',
    status: 'active',
  },
  {
    name: 'Ava Carter',
    email: 'ava.carter@amp.local',
    password: 'User@1234',
    role: 'user',
    status: 'active',
  },
  {
    name: 'Noah Patel',
    email: 'noah.patel@amp.local',
    password: 'User@1234',
    role: 'user',
    status: 'active',
  },
  {
    name: 'Mia Gomez',
    email: 'mia.gomez@amp.local',
    password: 'User@1234',
    role: 'user',
    status: 'disabled',
  },
];

const seedRecords: SeedRecord[] = [
  {
    userEmail: 'ava.carter@amp.local',
    verificationType: 'Identity Verification',
    status: 'approved',
    accessLevel: 'Employee Workspace',
    approvedByEmail: 'admin@amp.local',
  },
  {
    userEmail: 'ava.carter@amp.local',
    verificationType: 'Finance Portal Access',
    status: 'pending',
    accessLevel: 'Finance Viewer',
  },
  {
    userEmail: 'noah.patel@amp.local',
    verificationType: 'Operations Review',
    status: 'rejected',
    accessLevel: 'Operations Viewer',
    approvedByEmail: 'admin@amp.local',
  },
  {
    userEmail: 'mia.gomez@amp.local',
    verificationType: 'Legacy VPN Access',
    status: 'pending',
    accessLevel: 'Remote Access',
  },
  {
    userEmail: 'admin@amp.local',
    verificationType: 'Admin Privilege Review',
    status: 'approved',
    accessLevel: 'Platform Admin',
    approvedByEmail: 'admin@amp.local',
  },
];

const upsertUser = async (seed: SeedUser) => {
  const existing = await UserModel.findOne({ email: seed.email }).exec();
  if (existing) {
    return existing;
  }

  return UserModel.create(seed);
};

const upsertRecord = async (
  userId: string,
  seed: SeedRecord,
  approvedById?: string,
): Promise<void> => {
  await RecordModel.findOneAndUpdate(
    {
      userId,
      verificationType: seed.verificationType,
      accessLevel: seed.accessLevel,
    },
    {
      $set: {
        status: seed.status,
        approvedBy: approvedById ?? null,
      },
      $setOnInsert: {
        userId,
        verificationType: seed.verificationType,
        accessLevel: seed.accessLevel,
      },
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    },
  ).exec();
};

const main = async (): Promise<void> => {
  await connectDb(env.mongoDbUri);

  try {
    logger.info('seeding_started');

    const createdUsers = new Map<string, { _id: unknown; email: string; name: string }>();

    for (const seed of seedUsers) {
      const user = await upsertUser(seed);
      createdUsers.set(seed.email, { _id: user._id, email: user.email, name: user.name });
    }

    const admin = createdUsers.get('admin@amp.local');
    if (!admin) {
      throw new Error('Admin seed user could not be created');
    }

    for (const seed of seedRecords) {
      const owner = createdUsers.get(seed.userEmail);
      if (!owner) {
        throw new Error(`Seed owner not found for ${seed.userEmail}`);
      }

      const approvedBy = seed.approvedByEmail ? createdUsers.get(seed.approvedByEmail) : undefined;
      await upsertRecord(String(owner._id), seed, approvedBy ? String(approvedBy._id) : undefined);
    }

    logger.info('seeding_completed', {
      users: seedUsers.length,
      records: seedRecords.length,
      collectionNames: ['users', 'records'],
    });
  } finally {
    await disconnectDb();
  }
};

main().catch((error) => {
  logger.error('seeding_failed', {
    err: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
  });
  process.exit(1);
});
