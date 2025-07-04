import { User } from '../models/user';
import { openDB } from '../db/index';
import crypto from 'crypto';

export class UserRepository {
  static db = openDB();

  static async create(name: string, email: string): Promise<User> {
    const id = crypto.randomUUID();
    const createdAt = new Date();

    try {
      await this.db.run(
      'INSERT INTO users (id, name, email, createdAt) VALUES (?, ?, ?, ?)',
      [id, name, email, createdAt])
    } catch (error) {
      if ((error as Error).message.includes('UNIQUE constraint failed: users.email')) {
        throw new Error('Email already in use');
      }
      throw error;
    };
    return { id, name, email, createdAt };
  }

  static async deleteAll(): Promise<void> {
    await this.db.run('DELETE FROM users');
  }

}
