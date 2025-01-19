declare global {
    namespace TypeORM {
        interface Connection {
        getRepository<T>(entity: string): Repository<T>;
        }
    }
    }

export {};