import { UserModel } from '../models/user.model.js';
import { RecordModel } from '../models/record.model.js';

export class AnalyticsService {
  async getUserStats() {
    const totalUsers = await UserModel.countDocuments();
    const activeUsers = await UserModel.countDocuments({ status: 'active' });
    
    const roleDistribution = await UserModel.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    return {
      totalUsers,
      activeUsers,
      roleDistribution
    };
  }

  async getRecordStats() {
    const totalRecords = await RecordModel.countDocuments();
    const statusBreakdown = await RecordModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } }
    ]);

    const verificationTrends = await RecordModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
      { $limit: 30 }
    ]);

    return {
      statusBreakdown,
      verificationTrends
    };
  }

  async getDashboardData() {
    const [userStats, recordStats] = await Promise.all([
      this.getUserStats(),
      this.getRecordStats()
    ]);

    return {
      ...userStats,
      ...recordStats
    };
  }
}

export const analyticsService = new AnalyticsService();
