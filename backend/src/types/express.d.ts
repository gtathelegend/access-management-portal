declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        role: 'admin' | 'user';
      };
    }
  }
}

export {};
