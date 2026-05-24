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
    name: 'Security Lead',
    email: 'security@amp.local',
    password: 'Security@1234',
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
    name: 'Sophia Chen',
    email: 'sophia.chen@amp.local',
    password: 'User@1234',
    role: 'user',
    status: 'active',
  },
  {
    name: 'Lucas Miller',
    email: 'lucas.miller@amp.local',
    password: 'User@1234',
    role: 'user',
    status: 'active',
  },
  {
    name: 'Emma Wilson',
    email: 'emma.wilson@amp.local',
    password: 'User@1234',
    role: 'user',
    status: 'active',
  },
  {
    name: 'James Taylor',
    email: 'james.taylor@amp.local',
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
  {
    name: 'Oliver Brown',
    email: 'oliver.brown@amp.local',
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
    userEmail: 'sophia.chen@amp.local',
    verificationType: 'Cloud Console Access',
    status: 'approved',
    accessLevel: 'Developer Sandbox',
    approvedByEmail: 'security@amp.local',
  },
  {
    userEmail: 'lucas.miller@amp.local',
    verificationType: 'HR Database Access',
    status: 'pending',
    accessLevel: 'HR Coordinator',
  },
  {
    userEmail: 'emma.wilson@amp.local',
    verificationType: 'Marketing Tools',
    status: 'approved',
    accessLevel: 'Campaign Manager',
    approvedByEmail: 'admin@amp.local',
  },
  {
    userEmail: 'james.taylor@amp.local',
    verificationType: 'Customer Support Portal',
    status: 'pending',
    accessLevel: 'Support Agent',
  },
  {
    userEmail: 'mia.gomez@amp.local',
    verificationType: 'Legacy VPN Access',
    status: 'pending',
    accessLevel: 'Remote Access',
  },
  {
    userEmail: 'oliver.brown@amp.local',
    verificationType: 'Archived Files Access',
    status: 'rejected',
    accessLevel: 'Legacy Auditor',
    approvedByEmail: 'security@amp.local',
  },
  {
    userEmail: 'admin@amp.local',
    verificationType: 'Admin Privilege Review',
    status: 'approved',
    accessLevel: 'Platform Admin',
    approvedByEmail: 'security@amp.local',
  },
  {
    userEmail: 'security@amp.local',
    verificationType: 'Security Audit Access',
    status: 'approved',
    accessLevel: 'Global Auditor',
    approvedByEmail: 'admin@amp.local',
  },
];

const upsertUser = async (seed: SeedUser) => {
  const existing = await UserModel.findOne({ email: seed.email }).exec();
  if (existing) {
    // Update existing user to match seed data (e.g. status)
    Object.assign(existing, seed);
    return existing.save();
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
  await connectDb();

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
        logger.warn(`Seed owner not found for ${seed.userEmail}, skipping record`);
        continue;
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
