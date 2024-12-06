export interface IOrmAdapter<T = any> {
    // Basic CRUD Operations
    findById<E>(table: string, id: string): Promise<E | null>;
    findOne<E>(table: string, conditions: Record<string, any>): Promise<E | null>;
    findMany<E>(
        table: string, 
        conditions?: Record<string, any>, 
        options?: {
            page?: number;
            pageSize?: number;
            orderBy?: Record<string, 'asc' | 'desc'>;
            select?: string[];
        }
    ): Promise<E[]>;
    
    // Create operations
    create<E>(table: string, data: Partial<E>): Promise<E>;
    createMany<E>(table: string, data: Partial<E>[]): Promise<E[]>;
    
    // Update operations
    update<E>( table: string, conditions?: Record<string, any>, data: Partial<E>): Promise<E>;
    updateMany<E>( table: string, conditions: Record<string, any>, data: Partial<E>): Promise<number>;
    
    // Delete operations
    delete(table: string, conditions?: Record<string, any>): Promise<boolean>;
    deleteMany( table: string, conditions: Record<string, any>): Promise<number>;
    
    // Transaction support
    transaction<R>(callback: (trx: T) => Promise<R>): Promise<R>;
    
    // Raw query support
    rawQuery<R>(query: string, params?: any[]): Promise<R[]>;
    
    // Connection management
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}