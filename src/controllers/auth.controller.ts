import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { SignupDto } from "../dtos/SignupDto";
import { AuthService } from "../services/auth.service";
import { LoginDto } from "../dtos/LoginDto";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export class AuthController {

  static async validateAccessCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code } = req.query as { code: string };
      if (!code) {
        const error: any = new Error("Access code is required");
        error.status = 400;
        error.code = "MISSING_ACCESS_CODE";
        throw error;
      }
      const isValid = await AuthService.validateAccessCode(code);
      res.json({
        success: true,
        valid: isValid,
        message: isValid ? "Access code valid!" : "Access code invalid or already used",
      });
    } catch (err) {
      next(err);
    }
  }

  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const signupData = req.body as SignupDto;
      const { user, token } = await AuthService.signup(signupData);
      res.status(201).json({
        success: true,
        data: user,
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const loginData = req.body as LoginDto;
      const { user, token } = await AuthService.login(loginData);
      res.json({
        success: true,
        data: user,
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user.id) {
        const error: any = new Error("User not authenticated");
        error.status = 401;
        error.code = "UNAUTHENTICATED";
        throw error;
      }
      const userId = req.user.id;
      const { password, ...rest } = await AuthService.getMe(userId);
      res.json({ success: true, data: rest });
    } catch (err) {
      next(err);
    }
  }
}