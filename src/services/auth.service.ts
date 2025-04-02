import { SignupDto } from "../dtos/SignupDto";
import { LoginDto } from "../dtos/LoginDto";
import { AppDataSource } from "../config/db";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { AccessCode } from "../config/entities/accessCode.entity";
import { User } from "../config/entities/user.entity";

export class AuthService {
  private static userRepository = AppDataSource.getRepository(User);
  private static accessCodeRepository = AppDataSource.getRepository(AccessCode);


  static async signup(signupData: SignupDto) {
    const { email, password, accessCode } = signupData;
    const accessCodeEntity = await this.accessCodeRepository.findOne({
      where: { code: accessCode, isUsed: false },
    });

    if (!accessCodeEntity) {
      const error: any = new Error("Invalid or used access code");
      error.status = 400;
      error.code = "INVALID_ACCESS_CODE";
      throw error;
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      const error: any = new Error("User already exists");
      error.status = 400;
      error.code = "USER_EXISTS";
      throw error;
    }

   const hashedPassword = await argon2.hash(password);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      accessCode,
    });
    await this.userRepository.save(user);

    accessCodeEntity.isUsed = true;
    await this.accessCodeRepository.save(accessCodeEntity);

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    return { user: { id: user.id, email: user.email }, token };
  }

  static async login(loginData: LoginDto) {
    const { email, password } = loginData;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      const error: any = new Error("Invalid credentials");
      error.status = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      const error: any = new Error("Invalid credentials");
      error.status = 401;
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return { user: { id: user.id, email: user.email }, token };
  }

  static async getMe(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      const error: any = new Error("User not found");
      error.status = 404;
      error.code = "USER_NOT_FOUND";
      throw error;
    }
    return user;
  }
  static async validateAccessCode(code: string): Promise<boolean> {
    const accessCode = await this.accessCodeRepository.findOne({
      where: { code, isUsed: false },
    });
    return !!accessCode;
  }
}