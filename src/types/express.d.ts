// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      files?:
        | { [fieldname: string]: Express.Multer.File[] }
        | Express.Multer.File[]
        | undefined;
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
