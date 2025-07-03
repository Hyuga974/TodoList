import { User } from '../models/user';
import { db } from '../db';
import crypto from 'crypto';

export class UserRepository {
  static async create(name: string, email: string): Promise<User> {
    const id = crypto.randomUUID();
    const createdAt = new Date();
    const [result] = await db.query(
      'INSERT INTO users (id, name, email, createdAt) VALUES (?, ?, ?, ?)',
      [id, name, email, createdAt]
    );
    return { id, name, email, createdAt };
  }

  static async deleteAll(): Promise<void> {
    await db.query('DELETE FROM users');
  }
}
