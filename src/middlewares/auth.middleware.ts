// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Local interface to extend Request
interface AuthenticatedRequest extends Request {
  user?: jwt.JwtPayload;
}

interface AuthError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

export const authenticateJWT = (
  req: AuthenticatedRequest, 
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    const error: AuthError = new Error('No token provided. Authorization denied.');
    error.status = 401;
    error.code = 'NO_TOKEN_PROVIDED';
    return next(error);
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      const error: AuthError = new Error('Server configuration error: JWT secret not set');
      error.status = 500;
      error.code = 'JWT_SECRET_MISSING';
      throw error;
    }

    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    if (!decoded.id || !decoded.email) {
      const error: AuthError = new Error('Invalid token payload');
      error.status = 403;
      error.code = 'INVALID_TOKEN_PAYLOAD';
      throw error;
    }

    req.user = decoded; 
    next();
  } catch (err) {
    const authError: AuthError = err instanceof jwt.JsonWebTokenError
      ? new Error('Token is not valid')
      : err instanceof Error
      ? err
      : new Error('Authentication error');
    
    authError.status = authError.status || 403;
    authError.code = authError.code || 'INVALID_TOKEN';
    
    if (err instanceof jwt.TokenExpiredError) {
      authError.message = 'Token has expired';
      authError.code = 'TOKEN_EXPIRED';
    }

    next(authError);
  }
};