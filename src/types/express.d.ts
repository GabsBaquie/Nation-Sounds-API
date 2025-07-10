// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?: Express.Multer.File[];
      user: {
        id: number;
        role: "admin" | "user";
        username: string;
        email: string;
      };
      dto?: any;
    }
  }
}

export {};
