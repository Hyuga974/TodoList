import { User } from '../models/user';
import { UserRepository } from '../repositories/userRepository';

export class UserService {
    
  static validateName(name: string): boolean {
    return name.trim() !== '' && name.length <= 50;
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

    static async createUser(name: string, email: string): Promise<User> {
        if (!this.validateName(name)) {
            throw new Error("Name is required and cannot exceed 50 characters");
        }
        if (!this.validateEmail(email)) {
            throw new Error("Invalid email format");
        }
        try {
            const result = await UserRepository.create(name, email);
            return result;
        } catch (error) {
            if ((error as Error).message === 'Email already in use') {
                throw new Error('Email already in use');
            }
            throw error;
        }
    }

    static async listUsers() : Promise<User[]> {
        try {
            const users = await UserRepository.listAll();
            return users;
        } catch (error) {
            throw new Error('Error retrieving users: ' + (error as Error).message);
        }
    }

    static async deleteAllUsers(): Promise<void> {
        await UserRepository.deleteAll();
    }
}
