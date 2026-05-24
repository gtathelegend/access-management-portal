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