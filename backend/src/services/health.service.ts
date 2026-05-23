import mongoose from 'mongoose';

export interface HealthStatus {
  status: 'ok';
  timestamp: string;
  uptimeSeconds: number;
  mongo: {
    state: number;
    readyStateLabel: 'disconnected' | 'connected' | 'connecting' | 'disconnecting';
  };
}

const readyStateLabel = (state: number): HealthStatus['mongo']['readyStateLabel'] => {
  switch (state) {
    case 0:
      return 'disconnected';
    case 1:
      return 'connected';
    case 2:
      return 'connecting';
    case 3:
      return 'disconnecting';
    default:
      return 'disconnected';
  }
};

export const getHealth = (): HealthStatus => {
  const state = mongoose.connection.readyState;
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    mongo: {
      state,
      readyStateLabel: readyStateLabel(state),
    },
  };
};
