export interface IElasticsearchService {
    connect(): Promise<void>;
    checkHealth(): Promise<boolean>;
}