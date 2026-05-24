import { RecordModel } from '../models/record.model.js';
import { UserModel } from '../models/user.model.js';

export interface CountPoint {
  name: string;
  value: number;
}

export interface DashboardStatsResponse {
  totalUsers: number;
  activeUsers: number;
  adminCount: number;
  pendingVerifications: number;
  disabledUsers: number;
  recentActivityCount: number;
  verificationStats: {
    roleDistribution: CountPoint[];
    statusBreakdown: CountPoint[];
    verificationTrends: CountPoint[];
  };
}

type SummaryStats = {
  totalUsers: number;
  activeUsers: number;
  disabledUsers: number;
  adminCount: number;
};

type RecordSummaryStats = {
  pendingVerifications: number;
};

type CountResult = Array<{ count?: number }>;
type NamedCountResult = Array<CountPoint>;

type UserFacetResult = {
  summary?: SummaryStats[];
  roleDistribution?: NamedCountResult;
  recentActivity?: CountResult;
};

type RecordFacetResult = {
  summary?: RecordSummaryStats[];
  statusBreakdown?: NamedCountResult;
  verificationTrends?: NamedCountResult;
  recentActivity?: CountResult;
};

const RECENT_ACTIVITY_WINDOW_DAYS = 7;
const VERIFICATION_TREND_WINDOW_DAYS = 14;

const daysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const toCount = (result: CountResult | undefined): number => result?.[0]?.count ?? 0;
const toPoints = (result: NamedCountResult | undefined): CountPoint[] => result ?? [];

export class StatsService {
  async getDashboardStats(): Promise<DashboardStatsResponse> {
    const recentActivityCutoff = daysAgo(RECENT_ACTIVITY_WINDOW_DAYS);
    const trendCutoff = daysAgo(VERIFICATION_TREND_WINDOW_DAYS);

    const [userStats, recordStats] = await Promise.all([
      UserModel.aggregate([
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalUsers: { $sum: 1 },
                  activeUsers: {
                    $sum: {
                      $cond: [{ $eq: ['$status', 'active'] }, 1, 0],
                    },
                  },
                  disabledUsers: {
                    $sum: {
                      $cond: [{ $eq: ['$status', 'disabled'] }, 1, 0],
                    },
                  },
                  adminCount: {
                    $sum: {
                      $cond: [{ $eq: ['$role', 'admin'] }, 1, 0],
                    },
                  },
                },
              },
            ],
            roleDistribution: [
              {
                $group: {
                  _id: '$role',
                  value: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  name: '$_id',
                  value: 1,
                },
              },
              { $sort: { name: 1 } },
            ],
            recentActivity: [
              {
                $match: {
                  $or: [
                    { createdAt: { $gte: recentActivityCutoff } },
                    { updatedAt: { $gte: recentActivityCutoff } },
                  ],
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ]).exec(),
      RecordModel.aggregate([
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  pendingVerifications: {
                    $sum: {
                      $cond: [{ $eq: ['$status', 'pending'] }, 1, 0],
                    },
                  },
                },
              },
            ],
            statusBreakdown: [
              {
                $group: {
                  _id: '$status',
                  value: { $sum: 1 },
                },
              },
              {
                $project: {
                  _id: 0,
                  name: '$_id',
                  value: 1,
                },
              },
              { $sort: { name: 1 } },
            ],
            verificationTrends: [
              {
                $match: {
                  createdAt: { $gte: trendCutoff },
                },
              },
              {
                $group: {
                  _id: {
                    $dateToString: {
                      format: '%Y-%m-%d',
                      date: '$createdAt',
                    },
                  },
                  value: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
              {
                $project: {
                  _id: 0,
                  name: '$_id',
                  value: 1,
                },
              },
            ],
            recentActivity: [
              {
                $match: {
                  $or: [
                    { createdAt: { $gte: recentActivityCutoff } },
                    { updatedAt: { $gte: recentActivityCutoff } },
                  ],
                },
              },
              { $count: 'count' },
            ],
          },
        },
      ]).exec(),
    ]);

    const userFacet = userStats[0] as UserFacetResult | undefined;
    const recordFacet = recordStats[0] as RecordFacetResult | undefined;
    const userSummary = userFacet?.summary?.[0];
    const recordSummary = recordFacet?.summary?.[0];

    return {
      totalUsers: userSummary?.totalUsers ?? 0,
      activeUsers: userSummary?.activeUsers ?? 0,
      adminCount: userSummary?.adminCount ?? 0,
      pendingVerifications: recordSummary?.pendingVerifications ?? 0,
      disabledUsers: userSummary?.disabledUsers ?? 0,
      recentActivityCount: toCount(userFacet?.recentActivity) + toCount(recordFacet?.recentActivity),
      verificationStats: {
        roleDistribution: toPoints(userFacet?.roleDistribution),
        statusBreakdown: toPoints(recordFacet?.statusBreakdown),
        verificationTrends: toPoints(recordFacet?.verificationTrends),
      },
    };
  }
}

export const statsService = new StatsService();