import { OrmAdapterError } from '@auth/core/errors/orm-adapter.error';
import { CONTAINER_TYPES } from '@auth/core/interfaces/constants/container.types';
import { IOrmAdapter } from '@auth/core/interfaces/database/orm-adapter.interface';
import { LoggerConfiguration } from '@auth/core/interfaces/logger/config.interface';
import { ILogger } from '@auth/core/interfaces/logger/logger.interface';
import { ConfigService } from '@auth/infrastructure/config/config.service';
import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

@injectable()
export class PrismaOrmAdapter implements IOrmAdapter<PrismaClient> {
    private client: PrismaClient;
    private logger: ILogger

    constructor(
        @inject(ConfigService) private config: ConfigService,
        @inject(CONTAINER_TYPES.ILogger) loggerFactory: (conf: LoggerConfiguration) => ILogger
    ) {
        this.logger = loggerFactory({ name: "authPrismaOrmAdapter" });
        this.client = new PrismaClient({
            datasources: {
                db: {
                  url: this.config.get('MYSQL_URL', ''),
                },
              }
        });
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.info('Connected to prisma database');
        } catch (error: any) {
            this.logger.error('Prisma database connection failed', error);
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }

    async findById<E>(table: string, id: string): Promise<E | null> {
        try {
            return await (this.client as any)[table].findUnique({
                where: { id }
            });
        } catch (error) {
            this.handleError(error, 'findById');
        }
    }

    async findOne<E>(
        table: string, 
        conditions: Record<string, any>
    ): Promise<E | null> {
        try {
            return await (this.client as any)[table].findFirst({
                where: conditions
            });
        } catch (error) {
            this.handleError(error, 'findOne');
        }
    }

    async findMany<E>(
        table: string, 
        conditions?: Record<string, any>, 
        options?: {
            page?: number;
            pageSize?: number;
            orderBy?: Record<string, 'asc' | 'desc'>;
            select?: string[];
        }
    ): Promise<E[]> {
        try {
            const query: any = { where: conditions || {} };

            if (options?.page && options?.pageSize) {
                query.skip = (options.page - 1) * options.pageSize;
                query.take = options.pageSize;
            }

            if (options?.orderBy) {
                query.orderBy = options.orderBy;
            }

            if (options?.select) {
                query.select = options.select.reduce((acc: Record<string, any>, field) => {
                    acc[field] = true;
                    return acc;
                }, {});
            }

            return await (this.client as any)[table].findMany(query);
        } catch (error) {
            this.handleError(error, 'findMany');
        }
    }

    async create<E>(table: string, data: Partial<E>): Promise<E> {
        try {
            return await (this.client as any)[table].create({ data });
        } catch (error) {
            this.handleError(error, 'create');
        }
    }

    async createMany<E>(table: string, data: Partial<E>[]): Promise<E[]> {
        try {
            return await (this.client as any)[table].createMany({ data });
        } catch (error) {
            this.handleError(error, 'createMany');
        }
    }

    async update<E>(
        table: string, 
        conditions: Record<string, any>, 
        data: Partial<E>
    ): Promise<E> {
        try {
            return await (this.client as any)[table].update({
                where: conditions,
                data
            });
        } catch (error) {
            this.handleError(error, 'update');
        }
    }

    async updateMany<E>(
        table: string, 
        conditions: Record<string, any>, 
        data: Partial<E>
    ): Promise<number> {
        try {
            const result = await (this.client as any)[table].updateMany({
                where: conditions,
                data
            });
            return result.count;
        } catch (error) {
            this.handleError(error, 'updateMany');
        }
    }

    async delete(table: string, conditions: Record<string, any>): Promise<boolean> {
        try {
            await (this.client as any)[table].delete({
                where: conditions
            });
            return true;
        } catch (error) {
            this.handleError(error, 'delete');
        }
    }

    async deleteMany(
        table: string, 
        conditions: Record<string, any>
    ): Promise<number> {
        try {
            const result = await (this.client as any)[table].deleteMany({
                where: conditions
            });
            return result.count;
        } catch (error) {
            this.handleError(error, 'deleteMany');
        }
    }

    async transaction<R>(callback: (trx: PrismaClient) => Promise<R>): Promise<R> {
        return this.client.$transaction(callback as any) as any;
    }

    async rawQuery<R>(query: string, params?: any[]): Promise<R[]> {
        try {
            return await this.client.$queryRawUnsafe(query, ...(params || []));
        } catch (error) {
            this.handleError(error, 'rawQuery');
        }
    }

    private handleError(error: any, method: string): never {
        console.error(`PrismaOrmAdapter error in ${method}:`, error);
        throw new OrmAdapterError(`ORM operation failed: ${error.message}`, error);
    }
}