export interface IRedisRepository {
    connect(): Promise<void>
    /**
     * Set a key-value pair with optional expiration
     * @param key Redis key
     * @param value Value to store
     * @param expirationInSeconds Optional expiration time in seconds
     */
    set(key: string, value: string | object, expirationInSeconds?: number): Promise<void>;
  
    /**
     * Get a value by key
     * @param key Redis key
     * @returns Stored value or null
     */
    get<T = string>(key: string): Promise<T | null>;
  
    /**
     * Delete a key
     * @param key Redis key to delete
     */
    delete(key: string): Promise<void>;
  
    /**
     * Check if a key exists
     * @param key Redis key to check
     * @returns Boolean indicating key existence
     */
    exists(key: string): Promise<boolean>;
  
    /**
     * Increment a numeric key
     * @param key Redis key
     * @returns New value after increment
     */
    increment(key: string): Promise<number>;
  
    /**
     * Set a value only if the key does not exist
     * @param key Redis key
     * @param value Value to store
     * @returns Boolean indicating if operation was successful
     */
    setNX(key: string, value: string | object): Promise<boolean>;
  
    /**
     * Add a member to a set
     * @param key Redis set key
     * @param member Member to add to the set
     */
    addToSet(key: string, member: string): Promise<void>;
  
    /**
     * Check if a member exists in a set
     * @param key Redis set key
     * @param member Member to check
     * @returns Boolean indicating member existence
     */
    isInSet(key: string, member: string): Promise<boolean>;
  }