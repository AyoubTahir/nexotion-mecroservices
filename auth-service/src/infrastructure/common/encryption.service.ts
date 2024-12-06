import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IEncryptionService } from "@auth/core/interfaces/services/encryption-service.interface";
import { injectable } from "inversify";

@injectable()
export class EncryptionService implements IEncryptionService {
    // Generate cryptographically secure random token
    generateSecureToken(length: number = 64): string {
      return crypto.randomBytes(length).toString('hex');
    }
  
    // Advanced password hashing with increased complexity
    async hash(str: string, salt: number): Promise<string> {
      return await bcrypt.hash(str, salt);
    }
  
    // Secure password comparison
    async compareHash(plain: string, hashed: string): Promise<boolean> {
      return await bcrypt.compare(plain, hashed);
    }
  
    // Advanced encryption with additional security
    encrypt(data: string, key: string): string {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(
        'aes-256-gcm', 
        Buffer.from(key, 'hex'), 
        iv
      );
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      const authTag = cipher.getAuthTag().toString('hex');
      return `${iv.toString('hex')}:${encrypted}:${authTag}`;
    }
  
    // Advanced decryption with integrity check
    decrypt(encryptedData: string, key: string): string {
      const [ivHex, encrypted, authTagHex] = encryptedData.split(':');
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      
      const decipher = crypto.createDecipheriv(
        'aes-256-gcm', 
        Buffer.from(key, 'hex'), 
        iv
      );
      decipher.setAuthTag(authTag);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    }

    generateJwtToken(data: Record<string, any>, secret: string, options: Record<string, any>): string {
        return jwt.sign(data, secret, options);
    }

    verifyJwtToken<E>(token: string, secret: string, options: Record<string, any>): E | null {
        return jwt.verify(token, secret, options) as E | null;
    }
  }