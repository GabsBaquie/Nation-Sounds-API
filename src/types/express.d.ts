// Extension de l'interface Request d'Express pour inclure les propriétés personnalisées
declare global {
  namespace Express {
    interface Request {
      dto?: any;
      user?: {
        id: number;
        username: string;
        email: string;
        role: "admin" | "user";
      };
    }
  }
}

export {};
