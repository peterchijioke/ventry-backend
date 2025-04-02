// services/AuthService.ts
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { LoginDto } from '../dtos/LoginDto';
import { SignupDto } from '../dtos/SignupDto';
import { User } from '../config/entities/user.entity';

export class AuthService {
  static async signup({ email, password, accessCode }: SignupDto) {
    // Invite-only logic
    if (process.env.INVITE_ONLY === 'true') {
      const validAccessCode = process.env.ACCESS_CODE || 'SECRET123';
      if (accessCode !== validAccessCode) {
        const error: any = new Error('Invalid access code');
        error.status = 403;
        error.code = 'INVALID_ACCESS_CODE';
        throw error;
      }
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      const error: any = new Error('Email already in use');
      error.status = 400;
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    const hashedPassword = await argon2.hash(password);
    const user = User.create({
      email,
      password: hashedPassword,
    });
    await user.save();

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: '1h',
    });

    return { user: { id: user.id, email: user.email }, token };
  }

  static async login({ email, password }: LoginDto) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error: any = new Error('Invalid credentials');
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      const error: any = new Error('Invalid credentials');
      error.status = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET not configured');
    const token = jwt.sign({ id: user.id, email: user.email }, secret, {
      expiresIn: '1h',
    });

    return { user: { id: user.id, email: user.email }, token };
  }

  static async getMe(userId: string) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      const error: any = new Error('User not found');
      error.status = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }
    return user;
  }
}