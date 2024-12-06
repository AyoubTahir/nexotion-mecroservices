export interface IEncryptionService {
    /**
     * Generates a cryptographically secure random token
     * @param length - Length of the token in bytes (default: 64)
     * @returns Hexadecimal string representation of the random token
     */
    generateSecureToken(length?: number): string;
  
    /**
     * Hashes a password using bcrypt
     * @param password - Plain text password to hash
     * @param salt - Salt to use in the hashing process
     * @returns Hashed password
     */
    hash(str: string, salt: number): Promise<string>;
  
    /**
     * Compares a plain text password with a hashed password
     * @param plain - Plain text password
     * @param hashed - Hashed password to compare against
     * @returns Boolean indicating if the passwords match
     */
    compareHash(plain: string, hashed: string): Promise<boolean>;
  
    /**
     * Encrypts data using AES-256-GCM encryption
     * @param data - Data to encrypt
     * @param key - Encryption key in hexadecimal format
     * @returns Encrypted data with IV and authentication tag
     */
    encrypt(data: string, key: string): string;
  
    /**
     * Decrypts data encrypted with AES-256-GCM
     * @param encryptedData - Encrypted data string containing IV, encrypted content, and auth tag
     * @param key - Decryption key in hexadecimal format
     * @returns Decrypted data
     */
    decrypt(encryptedData: string, key: string): string;
  
    /**
     * Generates a JSON Web Token (JWT)
     * @param data - Payload data to be encoded in the token
     * @param secret - Secret key for signing the token
     * @param options - Additional JWT signing options
     * @returns Signed JWT token
     */
    generateJwtToken(data: Record<string, any>, secret: string, options: Record<string, any>): string;
  
    /**
     * Verifies and decodes a JSON Web Token (JWT)
     * @param token - JWT token to verify
     * @param secret - Secret key used to sign the token
     * @param options - Verification options
     * @returns Decoded token payload or null if verification fails
     */
    verifyJwtToken<E>(token: string, secret: string, options: Record<string, any>): E | null;
  }