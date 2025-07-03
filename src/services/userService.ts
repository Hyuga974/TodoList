import { User } from '../models/user';
import { UserRepository } from '../repository/userRepository';

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
    return UserRepository.create(name, email);
  }

  static async deleteAllUsers(): Promise<void> {
    await UserRepository.deleteAll();
  }
}
