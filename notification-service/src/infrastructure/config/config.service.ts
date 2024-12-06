import * as dotenv from 'dotenv';
import * as path from 'path';
import { injectable } from 'inversify';

@injectable()
export class ConfigService {
  private config: Record<string, string> = {};

  loadEnvironment(envFile?: string): void {
    const envPath = envFile || this.getEnvPath();
    
    dotenv.config({ path: envPath });
    
    // Load all environment variables
    Object.keys(process.env).forEach(key => {
      this.config[key] = process.env[key] as string;
    });
  }

  private getEnvPath(): string {
    const environment = process.env.NODE_ENV || 'development';
    return path.resolve(`config/${environment}.env`);
  }

  get<T = string>(key: string, defaultValue?: T): T {
    const value = this.config[key] ?? defaultValue;
    
    if (value === undefined) {
      throw new Error(`Configuration key '${key}' not found`);
    }

    return value as T;
  }

  getBoolean(key: string, defaultValue = false): boolean {
    const value = this.get(key, defaultValue.toString());
    return ['true', '1', 'yes'].includes(value.toLowerCase());
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.get(key, defaultValue?.toString());
    const parsed = Number(value);
    
    if (isNaN(parsed)) {
      throw new Error(`Configuration key '${key}' is not a valid number`);
    }
    
    return parsed;
  }
}