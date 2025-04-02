import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  code?: string;
  details?: any;
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  const response: {
    success: boolean;
    status: number;
    error: {
      message: string;
      code: string;
      details?: any;
    };
    stack?: string;
  } = {
    success: false,
    status,
    error: {
      message,
      code,
      ...(err.details && { details: err.details }),
    },
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(status).json(response);
};

export default errorMiddleware;
