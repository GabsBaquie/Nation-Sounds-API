// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
        username: string;
        email: string;
      };
    }
  }
}

export {};
